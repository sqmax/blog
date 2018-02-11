---
layout: post
title: "JavaWeb基础（二）-Servlet总结"
date: 2018-02-10
author: SunQiang
categories: JavaWeb基础
tags: JavaWeb Servlet
---
* content
{:toc}
Servlet通常被称为服务器端小程序，是运行在服务器端的程序，用于处理及响应客服端的请求。自MVC规范出现后，Servlet的责任开始明确下来，仅仅作为控制器使用。




## Servlet定义
Servlet是个特殊的Java类，这个Java类必须继承HttpServlet。Servlet通常被称为服务器端小程序，是运行在服务器端的程序，用于处理及响应客服端的请求。自MVC规范出现后，Servlet的责任开始明确下来，仅仅作为控制器使用。Servlet与客户端通过Servlet容器进行交互,Servlet提供不同的方法用于响应客户端请求。
* doGet:用于响应客户端的GET请求。
* doPost:用于响应客户端的POST请求。
* doPut:用于响应客户端的PUT请求。
* doDelete:用于响应客户端的DELETE请求。

事实上，客户端的请求通常只有GET和POST两种，Servlet为了响应这两种请求，必须重写doGet和doPost方法。大部分时候，Servlet对于所有请求的响应都是一样的，只需重写一个方法来代替上面的几个方法：只需重写service()方法即可响应客户端的所有请求。
Servlet在服务器端充当的角色如下图
![](http://wx4.sinaimg.cn/large/0072Njp2ly1focq1a96ikj30iz06gmzf.jpg)
附：[Servlet API文档](https://tomcat.apache.org/tomcat-8.0-doc/servletapi/index.html)

## Servlet的调用过程和生命周期

![](http://wx4.sinaimg.cn/large/0072Njp2ly1focr862r7kj30eg0b975m.jpg)
Servlet的生命周期可以归纳为一下几步：

1. 装载Servlet，这一项操作一般是动态执行的。然而，Servlet通常会提供一个管理的选项，用于在Servlet启动时强制装载和初始化特定的Servlet。
2. Server创建一个Servlet实例。
3. Server调用Servlet的init()方法。
4. 一个客户端请求到达Server。
5. Server创建一个请求对象。
6. Server创建一个响应对象。
7. Server激活Servlet的service()方法，传递请求和响应对象作为参数。
8. service()方法获得关于请求对象的信息，处理请求，访问其他资源，获得需要的信息。
9. service()方法使用响应对象的方法,将响应传回Server，最终到达客户端。service()方法可能激活其他方法以处理请求。如doGet，doPost或其他程序员自己开发的方法。
10. 对于更多的客户端请求，Server创建新的请求和响应对象，仍然激活此Servlet的service()方法，将这两个对象作为参数传递给它，如此重复以上的循环，但无需再次调用init()方法，Servlet一般只初始化一次。
11. 当Server不再需要Servlet时，比如当Server要关闭时，Server调用Servlet的destroy()。

## 开发并配置一个简单的Servlet
将编译好的Servlet class文件放到web应用的WEB-INF/classes路径下，然后为了让Servlet能够响应用户请求，还必须将Servlet配置在web应用中。配置Servlet时，需要修改web.xml文件。不过从Servlet3.0开始，新增了注解的方式配置Servlet,只需Servlet类上用@WebServlet注解即可配置一个Servlet。
下面通过注解配置一个简单的Servlet。

```
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author root
 *
 */
@WebServlet(name = "firstServlet", urlPatterns = { "/firstServlet" })
public class FirstServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("text/html;charSet=UTF-8");
		PrintWriter pw = response.getWriter();
		pw.println("Hello Servlet!");
	}
}

```
其对应的web.xml配置如下

```
<servlet>
	<servlet-name>firstServlet</servlet-name>
	<servlet-class>FirstServlet</servlet-class>
</servlet>
<servlet-mapping>
	<servlet-name>firstServlet</servlet-name>
	<url-pattern>/firstServlt</url-pattern>
<servlet-mapping>
```

## load-on-startup Servlet

创建Servlet实例有两个时机：用户请求之时或应用启动之时，应用启动时就创建的Servlet，通常适用于某些后台服务的Servlet，或者需要拦截很多请求的Servlet，这种Servlet通常作为应用的基础Servlet使用，提供重要的后台服务。
配置load-on-startup的Servlet有两种方式。

* 在web.xml中通过`<servlet>`元素的`<load-on-startup>`子元素进行配置。
* 通过@WebServlet注解的loadOnStartup属性指定。

其中`<load-on-startup>`元素或loadOnStartup属性都接受一个整型值，越小，Servlet越优先实例化。

## 参考

* [Servlet入门总结及第一个Servlet程序](http://blog.csdn.net/evankaka/article/details/45151569)
* [Servlet和Jsp生命周期解读](http://blog.csdn.net/evankaka/article/details/46673051)












