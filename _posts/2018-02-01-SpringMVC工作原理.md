---
layout: post
title:  SpringMVC工作原理及其流程
date:   2018-02-01
author:  SunQiang
categories: SpringMVC 
tags: Spring SpringMVC
---

* content
{:toc}

本文介绍SpringMVC的基本原理，对于一个浏览器请求SpringMVC的处理流程。





## SpringMVC主要包含一下组件

* DispatcherServlet-前端控制器
* HandlerMapping-处理器映射
* Controller-控制器
* ViewResolver-视图解析器
* View-视图

## Spring的请求流程

SpringMVC的核心在于其请求流程，这是使用SpringMVC框架的基础，SpringMVC是一种基于Servlet的技术，它提供了核心控制器DispatcherServlet和相关的组件，并制定了松散的结构，以适合各种灵活的需求，下面结合流程图对SpringMVC做了一个简要的介绍 。

![](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1517499733177&di=ef30c99d3049143e66bdd5d522571c4b&imgtype=0&src=http%3A%2F%2Fstatic.oschina.net%2Fuploads%2Fspace%2F2014%2F0125%2F000146_Q892_1417419.png)图-1

* 请求旅程的第一站是Spring的DispatcherServlet。与大多数基于Java的Web框架一样,Spring MVC所有的请求都一个前端控制器(front controller)Servlet。前端控制器是常用的Web应用程序模式,在这里一个单实例的Servlet将请求委托给应用程序的其他组件来执行实际的处理。在Spring MVC中,DispatcherServlet就是前端控制器。
* DispatcherServlet的任务是将请求发送给Spring MVC控制器(controller)。控制器是一个用于处理请求的Sprin组件。在典型的应用程序中可能会有多个控制器,DispatcherServlet需要知道应该将请求发送给哪个控制器。所DispatcherServlet以会查询一个或多个处理器映射(handler mapping) 来确定请求的下一站在哪里。处理器映射会根据请求所携带的URL信息来进行决策。
*  一旦选择了合适的控制器,DispatcherServlet会将请求发送给选中的控制器 。到了控制器,请求会卸下其负载(用户提交的信息)并耐心等待控制器处理这些信息。(实际上,设计良好的控制器本身只处理很少甚至不处理工作,而是将业务逻辑委托给一个或多个服务对象进行处理。)
* 控制器在完成逻辑处理后,通常会产生一些信息,这些信息需要返回给用户并在浏览器上显示。这些信息被称为模(model)。不过仅仅给用户返回原始的信息是不够的——这些信息需要以用户友好的方式进行格式化,一般会是HTML。所以,信息需要发送给一个视图(view),通常会是JSP。
* 控制器所做的最后一件事就是将模型数据打包,并且标示出用于渲染输出的视图名。它接下来会将请求连同模型和视图名发送回DispatcherServlet 。这样,控制器就不会与特定的视图相耦合,传递给DispatcherServlet的视图名并不直接表示某个特定的JSP。实际上,它甚至并不能确定视图就是JSP。相反,它仅仅传递了一个逻辑名称,这个名字将会用来查找产生结果的真正视
图。DispatcherServlet将会使用视图解析器(view resolver)来将逻辑视图名匹配为一个特定的视图实现,它可能是也可能不是JSP。
* 既然DispatcherServlet已经知道由哪个视图渲染结果,那请求的任务基本上也就完成了。它的最后一站是视图的实现(可能是JSP) ,在这里它交付模型数据。请求的任务就完成了。视图将使用模型数据渲染输出,这个输出会通过响应对象传递给客户端(不会像听上去那样硬编码) 。

可以看到,请求要经过很多的步骤,最终才能形成返回给客户端的响应。大多数的步骤都是在Spring框架内部完成的,也就是图-1所示的组件中。

## 上面是我《Spring实战》上的解释，我感觉介绍的太简略了，后来有看到了一篇博客，写的非常详细，如下：


![](https://images2015.cnblogs.com/blog/249993/201612/249993-20161212142542042-2117679195.jpg)
图-2 SpringMVC的工作原理图

### SpringMVC流程

根据以上SpringMVC工作原理图，对其工作流程作如下总结

* 1、  用户发送请求至前端控制器DispatcherServlet。
* 2、  DispatcherServlet收到请求调用HandlerMapping处理器映射器。
* 3、  处理器映射器找到具体的处理器(可以根据xml配置、注解进行查找)，生成处理器对象及处理器拦截器(如果有则生成)一并返回给DispatcherServlet。
* 4、  DispatcherServlet调用HandlerAdapter处理器适配器。
* 5、  HandlerAdapter经过适配调用具体的处理器(Controller，也叫后端控制器)。
* 6、  Controller执行完成返回ModelAndView。
* 7、  HandlerAdapter将controller执行结果ModelAndView返回给DispatcherServlet。
* 8、  DispatcherServlet将ModelAndView传给ViewReslover视图解析器。
* 9、  ViewReslover解析后返回具体View。
* 10、DispatcherServlet根据View进行渲染视图（即将模型数据填充至视图中）。
* 11、 DispatcherServlet响应用户。

### 组件说明

* 1、前端控制器DispatcherServlet（不需要工程师开发）,由框架提供
作用：接收请求，响应结果，相当于转发器，中央处理器。有了dispatcherServlet减少了其它组件之间的耦合度。
用户请求到达前端控制器，它就相当于mvc模式中的c，dispatcherServlet是整个流程控制的中心，由它调用其它组件处理用户的请求，dispatcherServlet的存在降低了组件之间的耦合性。
* 2、处理器映射器HandlerMapping(不需要工程师开发),由框架提供
作用：根据请求的url查找Handler
HandlerMapping负责根据用户请求找到Handler即处理器，springmvc提供了不同的映射器实现不同的映射方式，例如：配置文件方式，实现接口方式，注解方式等。
* 3、处理器适配器HandlerAdapter
作用：按照特定规则（HandlerAdapter要求的规则）去执行Handler
通过HandlerAdapter对处理器进行执行，这是适配器模式的应用，通过扩展适配器可以对更多类型的处理器进行执行。

* 4、处理器Handler(**需要工程师开发**)
注意：编写Handler时按照HandlerAdapter的要求去做，这样适配器才可以去正确执行Handler
Handler 是继DispatcherServlet前端控制器的后端控制器，在DispatcherServlet的控制下Handler对具体的用户请求进行处理。
由于Handler涉及到具体的用户业务请求，所以一般情况需要工程师根据业务需求开发Handler。
* 5、视图解析器View resolver(不需要工程师开发),由框架提供
作用：进行视图解析，根据逻辑视图名解析成真正的视图（view）
View Resolver负责将处理结果生成View视图，View Resolver首先根据逻辑视图名解析成物理视图名即具体的页面地址，再生成View视图对象，最后对View进行渲染将处理结果通过页面展示给用户。 springmvc框架提供了很多的View视图类型，包括：jstlView、freemarkerView、pdfView等。
一般情况下需要通过页面标签或页面模版技术将模型数据通过页面展示给用户，需要由工程师根据业务需求开发具体的页面。
* 6、视图View(需要工程师开发jsp...)
View是一个接口，实现类支持不同的View类型（jsp、freemarker、pdf...）


下边两个组件通常情况下需要开发：

* Handler：处理器，即后端控制器用controller表示。
* View：视图，即展示给用户的界面，视图中通常需要标签语言展示模型数据。

## 结语

看到这是不是觉得非常乱，我也这么觉得，这就是我写这篇博客的原因了。刚开始学SpringMVC的时候，我就觉得有点晕，原来背后的原理这么复杂，以后学习一下相关的设计模式，对着源码慢慢消化吧！

 











