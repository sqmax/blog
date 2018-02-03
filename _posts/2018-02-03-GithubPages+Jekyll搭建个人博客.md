---
layout: post
title: "Github Pages+Jekyll搭建个人博客"
date: 2018-02-03
categories: 其它
tags: jekyll Github
---
本文记录了我搭建个人博客的过程。



整个安装过程需要安装：Ruby,RubyGems,Jekyll.
我本来是用Windows来搭建的，但在安装Jekyll是出了问题，而写没有找到解决的办法，所以我又切换到Linux系统下重新进行的。
## 安装Ruby

到ruby官网下载安装：[https://www.ruby-lang.org/en/downloads/](https://www.ruby-lang.org/en/downloads/)
官网介绍的个平台的安装方法:

![](https://wx3.sinaimg.cn/mw1024/0072Njp2ly1fo34qgvscxj30gw059q3b.jpg)


Linux用户直接可以用如下命令行安装，而不用以上官网介绍的方法：
![](https://wx1.sinaimg.cn/mw1024/0072Njp2ly1fo34ximoc0j308l00u3yb.jpg)
安装完之后，在命令行输入如下命令，得到ruby安装版本号，即安装成功
![]

## 安装RubyGems
到[RubyGems](https://rubygems.org/pages/download)官网下载TAGZ包，解要到一个目录下，该目录下有一个setup.rb文件，运行它
![]
当然也可以直接使用Linux命令行安装：
![]


## 安装Jekyll

Jekyll使用RubyGems来安装的，执行一下gem install jekyll命令来安装Jekyll
![]

## 第一篇博客
这是我们的环境已经搭建好了，现在就可以创建自己的博客站点了。
首先在命令行执行jekyll new命令，就会创建一个个人博客站点目录。
![]
该目录下包含的文件如下：
![]
可以看到该目录下有一个_posts目录，并且自动生成了一个.markdown类型的文件，其实我们就是在这里用markdown格式的语法写博客的。

进入到刚才创建的博客站点文件夹下，在本地开启服务器。
![]
在浏览器地址栏输入：http://localhost:4000/，可以在本地浏览个人的博客站点。
![]
















