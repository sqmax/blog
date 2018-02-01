---
layout: post
title:  SpringMVC组件及流程
date:   2018-02-01
author:  SunQiang
categories: SpringMVC 
tags: Spring SpringMVC
---

* content
{:toc}

本文介绍SpringMVC的基本原理，对于一个浏览器请求SpringMVC的处理流程。






## Spring的请求流程

*  每当用户在Web浏览器中点击链接或提交表单的时候，请求就开始工作了。在请求离开浏览器时 ,会带有用户所请求内容的信息,至少会包含请求的URL。但是还可能带有其的信息,例如用户提交的表单信息。
*  请求旅程的第一站是Spring的DispatcherServlet。与大多数基于Java的Web框架一样,Spring MVC所有的请求都一个前端控制器(front controller)Servlet。前端控制器是常用的Web应用程序模式,在这里一个单实例的Servlet将请求委托给应用程序的其他组件来执行实际的处理。在Spring MVC中,DispatcherServlet就是前端控制器。
*  DispatcherServlet的任务是将请求发送给Spring MVC控制器(controller)。控制器是一个用于处理请求的Sprin组件。在典型的应用程序中可能会有多个控制器,DispatcherServlet需要知道应该将请求发送给哪个控制器。所DispatcherServlet以会查询一个或多个处理器映射(handler mapping) 来确定请求的下一站在哪里。处理器映射会根据请求所携带的URL信息来进行决策。
*  一旦选择了合适的控制器,DispatcherServlet会将请求发送给选中的控制器 。到了控制器,请求会卸下其负载(用户提交的信息)并耐心等待控制器处理这些信息。(实际上,设计良好的控制器
本身只处理很少甚至不处理工作,而是将业务逻辑委托给一个或多个服务对象进行处理。)
* 控制器在完成逻辑处理后,通常会产生一些信息,这些信息需要返回给用户并在浏览器上显示。这些信息被称为模(model)。不过仅仅给用户返回原始的信息是不够的——这些信息需要以用户友好的方式进行格式化,一般会是HTML。所以,信息需要发送给一个视图(view),通常会是JSP。
* 控制器所做的最后一件事就是将模型数据打包,并且标示出用于渲染输出的视图名。它接下来会将请求连同模型和视图名发送回DispatcherServlet 。这样,控制器就不会与特定的视图相耦合,传递给DispatcherServlet的视图名并不直接表示某个特定的JSP。实际上,它甚至并不能确定视图就是JSP。相反,它仅仅传递了一个逻辑名称,这个名字将会用来查找产生结果的真正视
图。DispatcherServlet将会使用视图解析器(view resolver)来将逻辑视图名匹配为一个特定的视图实现,它可能是也可能不是JSP。
* 既然DispatcherServlet已经知道由哪个视图渲染结果,那请求的任务基本上也就完成了。它的最后一站是视图的实现(可能是JSP) ,在这里它交付模型数据。请求的任务就完成了。视图将使用
模型数据渲染输出,这个输出会通过响应对象传递给客户端(不会像听上去那样硬编码) 。
* 可以看到,请求要经过很多的步骤,最终才能形成返回给客户端的响应。大多数的步骤都是在Spring框架内部完成的,也就是图5.1所示的组件中。

## 后续

*  整个安装过程参考了jekyll官网，注意jekyll还有一个简体中文官网，不过比较坑（我就被坑了），有些内容没有翻译过来，有可能会走弯路，建议如果想看中文的相关资料，也要中英对照着阅读。[jekyll中文网 http://jekyllcn.com](http://jekyllcn.com), [jekyll英文网 http://jekyllrb.com](http://jekyllrb.com)
*  jekyll中的css是用sass写的，当然直接在`_sass/_layout.scss`中添加css也是可以的。
*  本文是用Markdown格式来写的，相关语法可参考： [Markdown 语法说明 (简体中文版) http://wowubuntu.com/markdown/](http://wowubuntu.com/markdown/)  
*  按照本文的说明搭建完博客后，用`github Pages`托管就可以看到了。注意，在github上面好像不支持rouge，所以要push到github上时，我将配置文件_config.yml中的代码高亮改变为`highlighter: pygments`就可以了
*  博客默认是没有评论系统的，本文的评论系统使用了多说，详细安装办法可访问[多说官网 http://duoshuo.com/](http://duoshuo.com/)，当然也可以使用[搜狐畅言 http://changyan.sohu.com/](http://changyan.sohu.com/)作为评论系统。
*  也可以绑定自己的域名，如果没有域名，可以在[godaddy http://www.godaddy.com/](http://www.godaddy.com/)上将域名放入购物车等待降价，买之。
*  祝各位新年快乐！








