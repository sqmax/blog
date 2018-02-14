---
layout: post
title: "JavaWeb基础（五）-Filter和Listener"
date: 2018-02-13 16:14
categories: JavaWeb基础
author: SunQiang
tags: JavaWeb Servlet
---
* content
{:toc}
Filter和Listener都可以认为是Servlet的一种”加强版“，学习了Servlet之后，相信一定很容易理解Filter和Listener。



## Filter

### Filter定义及类型
Filter作为一种”加强版“的Servlet，它主要用于对用户请求进行预处理，也可以对HttpServletResponse进行后处理，是个典型的处理链。Filter也可对用户请求生成响应，这一点与Servlet相同，但实际上很少使用Filter向用户请求生成响应。使用Filter完整的流程是：Filter对用户请求进行预处理，接着将请求交给Servlet进行处理并生成响应，最后Filter再对服务器响应进行后处理。<br/>
Filter由如下几个用途：

* 在HttpServletRequest到达Servlet之前，拦截客户的HttpServletRequest。 
* 根据需要检查HttpServletRequest，也可以修改HttpServletRequest头和数据。
* 在HttpServletResponse到达客户端之前，拦截HttpServletResponse。
* 根据需要检查HttpServletResponse，也可以修改HttpServletResponse头和数据。
Filter有如下几个种类：

* 用户授权的Filter：Filter负责检查用户请求，根据请求过滤用户非法请求。
* 日志Filter： 详细记录某些特殊的用户请求。
* 负责解码的Filter： 包括对非标准编码的请求解码。
* 能改变XML内容的XSLT Filter等。
附：[Filter API文档](http://tomcat.apache.org/tomcat-8.5-doc/servletapi/index.html)

### 创建Filter
创建Filter必须实现javax.servlet.Filter接口，在该接口中定义了如下三个方法。
* `void init(FilterConfig config)`: 用于完成Filter的初始化。
* `void destroy()`: 用于Filter销毁前，完成某些资源的回收。
* `void doFilter(ServletRequest request,ServletResponse,FilterChain chain)`: 实现过滤功能，该方法就是对每个请求及响应增加的额外处理。

下面在web应用filterTest下创建一个日志Filter，这个Filter负责拦截所有的用户请求，并将请求的信息记录在日志中。

```java
@WebFilter(filterName="log",urlPatterns= {"/*"})
public class LogFilter implements Filter {
	private FilterConfig config;
	@Override
	public void init(FilterConfig config) throws ServletException {
		this.config=config;
	}
	@Override
	public void destroy() {
		this.config=null;
	}
	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		ServletContext context=this.config.getServletContext();
		long before=System.currentTimeMillis();
		System.out.println("开始过滤.....");
		HttpServletRequest hrequest=(HttpServletRequest)request;
		System.out.println("Filter已经拦截到用户的请求的地址:"+hrequest.getServletPath());
		chain.doFilter(request, response);
		long after=System.currentTimeMillis();
		System.out.println("过滤结束");
		System.out.println("请求被定位到"+hrequest.getRequestURI()+",所花时间为："+(after-before));
	}
}
```
随便向服务器发送一个请求，例如test.jsp。可以在控制台看到一下内容：

>开始过滤.....
Filter已经拦截到用户的请求的地址:/test.jsp
过滤结束
请求被定位到/filterTest/test.jsp,所花时间为：1

上面的Filter，仅在日志中记录请求的URL，对所有的请求都执行chain.doFilter(request,response)方法，当Filter对请求过滤后，依然将请求发送到目的地址。如果需要检查权限，可以在Filter中根据用户请求的HttpSession，判断用户权限是否足够。如果权限不够，直接调用重定向即可;权限足够的话，才调用chain.doFilter(request,response)方法，向目标发送请求。

## Listener

### Listener定义
当web应用在web容器中运行时，web应用内部会不断地发生各种事件：web应用被启动、web应用被停止、用户session开始、用户session结束、用户请求到达等，通常来说，这些web事件对开发者是透明的。Servlet API提供了大量监听器来监听web应用的内部事件，从而允许当web内部事件发生时，回调事件监听器内的方法。常用的web事件监听器接口有如下几个。
* `ServletContextListener`:用于监听web应用的启动和关闭。
* `ServletContextAttributeListener`:用于监听ServletContext范围(application)内属性的改变。
* `ServletRequestListener`：用于监听用户的请求。
* `ServletRequestAttributeListener`：用于监听ServletRequest范围（request）内属性的改变。
* `HttpSessionListener`: 用于监听用户session的开始和结束。
* `HttpSessionAttributeListener`: 用于监听HttpSession范围（session）内属性的改变。
附：[Listener API文档](http://tomcat.apache.org/tomcat-8.5-doc/servletapi/index.html)

### 创建Listener

创建Lisener与创建Filter一样，继承相应的接口，但使用的是@WebListener注解。




