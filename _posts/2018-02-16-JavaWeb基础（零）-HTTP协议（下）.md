---
layout: post
title: "JavaWeb基础（零）-HTTP协议（下）"
date: 2018-02-16 17:42
categories: JavaWeb基础
tags: HTTP JavaWeb
---
* content
{:toc}





## 请求和响应格式

请求格式
![](http://wx2.sinaimg.cn/mw690/0072Njp2ly1foinjt7re5j30jw0ahmy7.jpg)
响应格式
![](http://wx2.sinaimg.cn/mw690/0072Njp2ly1foinjxuqi9j30j60ag0tl.jpg)


## 告知服务器意图的HTTP方法

* Get: 获取资源
Get方法用来请求访问已被URI识别的资源。
* Post: 传输实体主体
Post方法用来传输实体的主体，并不是获取响应的主体内容。
* Put: 传输文件
就像FTP协议的文件上传一样，要求在请求报文的主体中包含文件内容，然后保存到请求URI指定的位置。
* Head: 获取文件首部
Head和Get方法一样，只是不返回报文主体部分。用于确认URI的有效性及资源更新的日期和时间等。
* Delete: 删除文件
与Put方法相反，Delete方法按URI删除指定的资源。
* Options: 询问支持的方法
Options方法用来查询针对请求URI指定的资源支持的方法。

## Get和Post方法的区别

1. 原理不同 
一般我们在浏览器输入一个网址访问网站都是GET请求；在FORM表单中，可以通过设置Method指定提交方式为GET或者POST提交方式，默认为GET提交方式。HTTP定义了与服务器交互的不同方式,其中最基本的四种：GET,POST,PUT,DELETE,HEAD，其中GET和HEAD被称为安全方法，因为使用GET和HEAD的HTTP请求不会产生什么动作。不会产生动作意味着GET和HEAD的HTTP请求不会在服务器上产生任何结果。但是安全方法并不是什么动作都不产生，这里的安全方法仅仅指不会修改信息。根据HTTP规范，POST可能会修改服务器上的资源的请求。 
2. 数据量 
GET传送的数据量较小，不能大于2KB。POST传送的数据量较大，一般默认为不受限制。 
3. 安全性、效率 
传统的比较都是觉得GET安全性非常低，POST安全性较高。因为GET请求的数据会暴露在地址栏中，而POST请求则不会。但是GET的执行效率比POST方法好。

## HTTP状态码
![](http://wx3.sinaimg.cn/mw690/0072Njp2ly1foingdufegj30ha0570sn.jpg)

## HTTP 首部字段

* 通用首部字段 <br/>
Cache-Control: 控制缓存的行为<br/>
Date: 创建报文的日期时间<br/>
Pragma: 报文指令<br/>
Via: 代理服务器的相关信息<br/>
Warning: 错误通知<br/>
.....
* 请求首部字段<br/>
Accept: 用户代理可处理的媒体类型<br/>
Accept-Charset: 优先的字符集<br/>
Accept-Encoding: 优先的内容编码<br/>
Accept-Language: 优先的内容编码<br/>
Host: 请求资源所在的服务器<br/>
Range: 实体的字节范围请求<br/>
.....
* 响应首部字段
Location: 令客户端重定向至指定的URI<br/>
Age: 推算资源创建经过的时间<br/>
Proxy-Authenticate: 代理服务器客户端的认证信息<br/>
Server: HTTP服务器的安装信息<br/>
Retry-After: 对再次发起请求的时机要求<br/>
......
* 实体首部字段
Allow: 资源可支持的HTTP方法<br/>
Content-Encoding: 实体主体适用的编码方式<br/>
Content-Language: 实体主体的自然语言<br/>
Content-Length: 实体主体的大小<br/>
Content-Location： 替代对应资源的URI<br/>
Expires: 实体主体过期的日期时间<br/>
Last-Modified: 资源的最后修改日期时间<br/>
......
