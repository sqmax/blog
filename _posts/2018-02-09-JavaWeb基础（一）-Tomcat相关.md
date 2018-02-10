---
layout:  post
title:  "JavaWeb基础（一）-Tomcat"
date:  2018-02-09
author:  SunQiang
categories:  JavaWeb基础
tags: Tomcat JavaWeb
---
* content
{:toc}
现在距离学习Web开发也有一年多的时间了，折腾过各种框架，又想去学习前端，现在的学习感觉有些迷茫。想当时对基础知识也是一知半解，觉得现在是时候巩固一下基础知识了，就从Servlet技术开始吧，从箱低翻出我大四学习WEB开发时买的第一本书，里面的介绍还是挺详细的。
<img src="http://wx1.sinaimg.cn/large/0072Njp2ly1foaj925bl4j32eo37k1l0.jpg" width="25%" height="25%"/>





在学习Servlet技术之前，先复习一下Servlet容器——Tomcat吧，作为Java领域最著名的开源Web容器，相信是每个初学JavaWeb的人都接触过的吧。

## 安装Tomcat服务器
Tomcat下载地址：[http://tomcat.apache.org](http://tomcat.apache.org)，解压即可。解压缩后有如下的文件结构。

* bin:存放启动和关闭Tomcat的命令的路径
* conf：存放Tomcat的配置，所有Tomcat的配置都在改路径下设置。
* lib:存放Tomcat服务器的核心类库（JAR文件），如果要扩展Tomcat的功能，也可将第三方类库复制到改路径下。
* logs:保存Tomcat每次运行后产生的日志。
* temp: 保存运行过程中生成的临时文件。
* webapps: 该路径用于自动部署Web应用，将Web应用复制到该路径下，Tomcat会将该应用制动部署在容器中。
* work:保存Web应用在运行过程中，编译生成的class文件。该文件夹可以删除，但每次启动Tomcat服务器是，系统将再次建立该路径。
* LIcense等相关文档。

启动Tomcat服务器：双击Tomcat安装路径下的bin目录中的starup.bat文件即可。

## 一个完整Web应用的结构

```
mail---------------------------Web应用所在目录
           |----html、jsp、css、js等文件，根目录下的文件外界可以直接访问
           |----WEB-INF目录
                    |---------classes目录(java类)
                    |---------lib目录(java类运行所需的jar包)
                    |---------web.xml(web应用的配置文件)
             WEB-INF 这个目录下的文件外界无法直接访问，由web服务器负责调用
```

## 手动部署Web应用

在Tomcat中部署Web应用的方式主要有以下几种。

* 利用Tomcat的自动部署。
该方式是最简单的，只要将一个Web应用复制到Tomcat的webapps下，系统就会把该应用部署到Tomcat中。
* 利用控制台部署Web应用。
在使用该方式之前，需要在conf目录的tomcat-users.xml中，添加一个用户如下：
```<user username="manager" password="manager" roles="manager-gui"/>```
然后启动tomcat容器，进入控制台，点击'''Manager App'''来部署web应用。
![](http://wx3.sinaimg.cn/large/0072Njp2ly1foaj92qnhbj30qb05h0ta.jpg)
部署之后，会发现Tomcat的webapps目录下多了一个文件夹，该文件夹的内容和webDemo文件夹的内容完全相同。其实该方式和方式一一样，懂事利用Tomcat自动部署。
* 无需将Web应用复制到Tomcat安装路径下。首先在conf目录下新建Catalina/localhost两层目录路径，在该目录下新建一个任意名字的xml文件例如sq.xml，内容如下：
```<Context docBase="G:/webDemo" debug="0" privileged="true"></Context>```
这样就把我的G盘下的webDemo这个web应用部署在Tomcat容器中了，而不用把该web应用放在Tomcat安装目录的webapps目录下。
该应用的URL地址为：http://localhost:8080/sq

## Tomcat的体系结构

![](http://wx1.sinaimg.cn/large/0072Njp2ly1foaj935f0fj30ln0dvmyv.jpg)

* Server：代表整个Tomcat，它包含所有的容器。
* Service：相当于一个集合，包含多个Connector（连接）、一个Engine（引擎），它还负责处理所有Connector（连接）获取的客户请求。
* Connector：一个Connector（连接）在指定的接口上侦听客户的请求，并将客户的请求交给Engine（引擎）来进行处理并获得回应返回给客户请求。
* Engine：一个Engine（引擎）下可以配置多个虚拟主机Host，每个主机都有一个域名，当Engine获得一个请求时，会把这个请求发送的相应的Host上，Engine有一个默认的虚拟主机，如果没有虚拟主机能够匹配这个请求，那就由这个默认的虚拟主机来进行处理请求。
* Host：代表一个Virtual host，每个虚拟主机都和某个网络域名想匹配，每个虚拟主机下面可以部署一个或者多个web app，每个web对应一个context，有一个context path，当一个host获取请求时，就把该请求匹配到某个context上。
* Context：一个context对应一个web aplication，一个web由一个或多个servlet组成，Context在创建的时候将根据配置文件CATALINA_HOME/conf/web.xml和WEBAPP_HOME/WEB-INF/web.xml载入servlet类，当context获取请求时，讲在自己的映射表中需找相匹配的servlet类，如果找到，则执行该类，获得请求的回应，并返回。

## 请求处理过程
Tomcat处理一个Http请求过程如下，假如有一个来自浏览器的请求：http://localhost:8080/webDemo/index

1. 服务器8080端口接收到客户发来的请求，被一个在那里监听的叫HTTP1.1的 Connector获取了这个链接请求。
2. Connector把请求交给同在Service下的Engine去处理，并等待Engine的响应。
3. Engine把url解析，并把请求传给相对应的Host处理，如果没有相对应的Host，则用默认名叫localhost的Host来处理。
4. Host再把url解析为/webDemo/index.html，匹配context-path为/webDemoway的Context去处理（如果匹配不到就把该请求交给路径名为””的Context去处理）。
5. context-path为/webDemo的Context会匹配Servlet Mapping为/index的Servlet处理；
6. 构造HttpServletRequest对象和HttpServletResponse对象，作为参数调用Servlet的doGet或doPost方法；
7. Context把处理完的HttpServletResponse对象返回给Host；
8. Host把HttpServletResponse对象返回给Engine；
9. Engine把HttpServletResponse对象返回给Connector；
10. Connector把HttpServletResponse对象返回给客户browser。

## 参考

* [Tomcat安装配置，配置，优化及负载均衡详解](http://www.cnblogs.com/rocomp/p/4802396.html)
* [初学 Java Web 开发，请远离各种框架，从 Servlet 开发](https://www.oschina.net/question/12_52027)
* [http://objcoding.com/2017/06/12/Tomcat-structure-and-processing-request-process/](http://objcoding.com/2017/06/12/Tomcat-structure-and-processing-request-process/)
* [https://brianway.github.io/2016/02/06/javaweb-note-1-Tomcat/](https://brianway.github.io/2016/02/06/javaweb-note-1-Tomcat/)
