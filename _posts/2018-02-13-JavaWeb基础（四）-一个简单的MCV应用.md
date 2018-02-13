---
layout: post
title: "JavaWeb基础（四）-一个简单的MVC应用"
date: 2018-02-13 15:00
author: SunQiang
categories: JavaWeb基础
tags: Servlet JSP 
---
* content
{:toc}
在标准的MVC模式中，Servlet作为控制器，JSP作为表现层（View），Model通常由JavaBean来充当（所有的业务逻辑、数据访问逻辑都在Model中实现，实际上隐藏在Model下的可能还有很多丰富的组件，例如DAO组件，领域对象等）。本文就介绍一个使用Servlet作为控制器的MVC应用，该应用演示了一个简单的登录验证。





## 视图层(登录界面和欢迎界面)
登录界面（login.jsp）

```html
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>
	<span style="color:red:font-weight:bold">
	<%if(request.getAttribute("err")!=null){
		out.println(request.getAttribute("err")+"<br/>");
	}%></span>
	<form id="login" method="post" action="login">
	用户名：<input type="text" name="username"/><br/>
	密&nbsp;&nbsp;&nbsp;&nbsp;码：<input type="pass" name="pass"/><br/>
	<input type="submit" value="登录"/><br/>
	</form>
</body>
</html>
```
欢迎界面`welcome.jsp`

```html
<%@ page contentType="text/html; charset=GBK" language="java" errorPage="" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title> 欢迎页面 </title>
	<meta name="website" content="http://www.crazyit.org" />
</head>
<body>
<h3>欢迎登录</h3>
<%=session.getAttribute("name")%>,欢迎登录！
</body>
</html>
```
登录界面是一个简单的表单页面，用于收集用户名和密码，并将请求提交到指定的Servlet，该Servlet充当控制器的角色

## 控制器Servlet
```java
package top.sqmax;

import java.io.IOException;

import java.sql.ResultSet;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet(name = "login", urlPatterns = { "/login" })
public class LoginServlet extends HttpServlet {

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * javax.servlet.http.HttpServlet#service(javax.servlet.http.HttpServletRequest,
	 * javax.servlet.http.HttpServletResponse)
	 */
	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		System.out.println("hello");
		String errMsg = "";
		RequestDispatcher rd;
		String username = request.getParameter("username");
		String pass = request.getParameter("pass");
		DbDao dd = new DbDao("com.mysql.jdbc.Driver", "jdbc:mysql://localhost:3306/liuyan", "root", "123456");
		try {
			ResultSet rs = dd.query("select pass from user_inf where name= ?", username);
			if (rs.next()) {
				if (rs.getString("pass").equals(pass)) {
					HttpSession session = request.getSession(true);
					session.setAttribute("name", username);
					rd = request.getRequestDispatcher("/welcome.jsp");
					rd.forward(request, response);
				} else {
					errMsg += "Your username don't match you password.Please try again!";

				}
			} else {
				errMsg += "Your username don't exist.Please sign up first.";
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		if (errMsg != null && !errMsg.equals("")) {
			rd = request.getRequestDispatcher("/login.jsp");
			request.setAttribute("err", errMsg);
			rd.forward(request, response);
		}
	}

}
```
控制器负责接收客户端的请求，它既不直接对客户端输出响应，也不处理用户请求，只调用JavaBean来处理用户请求；JavaBean处理结束后，Servlet根据处理结果，调用不同的JSP页面向浏览器呈现处理结果。<br/>
上面Servlet使用了`@WebServlet`注解，为该Servlet配置的URL为`/login`，因此向`/login`发送的请求将会交给该Servlet处理。<br/>

## Model层
下面是本应用的DbDao的代码。

```java
package top.sqmax;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * @author root
 *
 */
public class DbDao {
	private Connection conn;
	private String driver;
	private String url;
	private String username;
	private String pass;
	//省略getter,setter方法
	//........
	public DbDao() {
		
	}
	public DbDao(String driver,String url,String username,String pass) {
		this.driver=driver;
		this.url=url;
		this.username=username;
		this.pass=pass;
	}
	public Connection getConnection() throws SQLException, ClassNotFoundException {
		if(conn==null) {
			Class.forName(this.driver);
			conn=DriverManager.getConnection(url,username,this.pass);
		}
		return conn;
	}
	public boolean insert(String sql,Object...args) throws Exception {
		PreparedStatement pstmt=getConnection().prepareStatement(sql);
		for(int i=0;i<args.length;i++) {
			pstmt.setObject(i+1, args[i]);
		}
		if(pstmt.executeUpdate()!=1) {
			return false;
		}
		return true;
	}
	public ResultSet query(String sql,Object...args) throws Exception {
		PreparedStatement pstmt=getConnection().prepareStatement(sql);
		for(int i=0;i<args.length;i++) {
			pstmt.setObject(i+1, args[i]);
		}
		return pstmt.executeQuery();
	}
	public void modify(String sql,Object...args) throws Exception {
		PreparedStatement pstmt=getConnection().prepareStatement(sql);
		for(int i=0;i<args.length;i++) {
			pstmt.setObject(i+1, args[i]);
		}
		pstmt.executeUpdate();
		pstmt.close();
	}
	public void closeConnection() throws Exception {
		if(conn!=null&&!conn.isClosed()) {
			conn.close();
		}
	}
}
```
上面DbDao负责完成查询，插入，修改等操作。从整个应用的结构来看，流程非常清晰，MVC中各个角色都对应有相应的组件。

## 数据库脚本
```sql
drop database if exists liuyan;
create database liuyan;
use liuyan;
create table user_inf
(
	id int auto_increment primary key,
	name varchar(255),
	pass varchar(255)
);
insert into user_inf
values(null,'crazyit','123');
insert into user_inf
values(null,'tiger','123');
```
注：运行该应用需要安装MySQL数据库，将MySQL数据库驱动jar包放入web应用的WEB-INF/lib路径下，并在MySQl终端运行以上脚本。

