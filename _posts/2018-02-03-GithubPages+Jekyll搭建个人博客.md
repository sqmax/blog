---
layout: post
title: "Github Pages+Jekyll搭建个人博客"
date: 2018-02-03
author: SunQiang
categories: 其它
tags: jekyll Github
---
* content
{:toc}
本文记录了我搭建个人博客的过程。

![](http://wx4.sinaimg.cn/large/0072Njp2ly1focpmfbmv3j30qr085ab9.jpg)




我本来是用Windows来搭建的，但在安装Jekyll是出了问题，而且没有找到解决的办法，所以我又切换到Linux系统,下重新进行的，我这里是用的是Ubuntu 16.04LTS发行版本。整个安装过程需要安装：Ruby,RubyGems,Jekyll，看别的文章还要安装一些其它的东西，但我并没有自己安装，可能我的Linux本身就带有吧。

## 安装Ruby
到ruby官网下载安装：[https://www.ruby-lang.org/en/downloads/](https://www.ruby-lang.org/en/downloads/)
官网介绍的个平台的安装方法:

![](https://wx3.sinaimg.cn/mw1024/0072Njp2ly1fo34qgvscxj30gw059q3b.jpg)		

Linux用户直接可以用如下命令行安装，而不用以上官网介绍的方法：	

![](https://wx1.sinaimg.cn/mw1024/0072Njp2ly1fo34ximoc0j308l00u3yb.jpg)		

安装完之后，在命令行输入如下命令，得到ruby安装版本号，即安装成功	

![](http://wx1.sinaimg.cn/large/0072Njp2ly1fo3kzen0fuj30go011q2u.jpg)		


## 安装RubyGems

到[RubyGems](https://rubygems.org/pages/download)官网下载TAGZ包，解要到一个目录下，可以看到该目录下有一个setup.rb文件，在命令行输入：`ruby setup.rb`，然后回车。
	
![](http://wx1.sinaimg.cn/large/0072Njp2ly1fo3lcre6o3j30k003tjs5.jpg)		


## 安装Jekyll
Jekyll使用RubyGems来安装的，执行一下`gem install jekyll bundler`命令来安装Jekyll	

![](http://wx3.sinaimg.cn/large/0072Njp2ly1fo3kzfhpinj30b700k744.jpg)	
	
## 开始写博客
这是我们的环境已经搭建好了，现在就可以创建自己的博客站点了。
首先在命令行执行`jekyll new myblog`命令（这里myblog是随意起的），就会创建一个个人博客站点目录。	

![](http://wx1.sinaimg.cn/large/0072Njp2ly1fo3kzeqq1sj30cm00wmx1.jpg)	

该目录下包含的文件如下：	

![](http://wx3.sinaimg.cn/large/0072Njp2ly1fo3lcqpz8pj30ka02jjrk.jpg)	

可以看到该目录下有一个_posts目录，并且自动生成了一个.markdown类型的文件，其实我们就是在这里用markdown格式的语法写博客的。
进入到刚才创建的博客站点文件夹下，输入命令`jekyll s`,在本地启动服务器。	

![](http://wx1.sinaimg.cn/large/0072Njp2ly1fo3lcr2ithj30ir05iwf5.jpg)	

在浏览器地址栏输入：http://localhost:4000/，可以在本地浏览个人的博客站点。	

![](http://wx1.sinaimg.cn/large/0072Njp2ly1fo3lcrff7yj30rs0h5mye.jpg)	

## 将站点托管到Github
首先在自己的Github上建一个仓库，仓库名字一定要是这样：`自己Github帐号名.github.io`，例如我的Github帐号是sqmax,那么我的仓库名就是：`sqmax.github.io`		
然后克隆到本地

![](http://wx4.sinaimg.cn/mw690/0072Njp2ly1fo3m1i9r7xj30n0010mx3.jpg)		

把刚才建立的博客站点myblog目录下的所有文件拷贝到sqmax.github.io目录下，然后进入sqmax.github.io目录下，执行如下3个命令就可以把博客站点托管到github上。		
![](https://wx2.sinaimg.cn/mw1024/0072Njp2ly1fo3lopyf5jj30kc04imxx.jpg)		

然后在浏览其中输入：[https://sqmax.github.io](https://sqmax.github.io)就可以查看个人博客站点了。

## 克隆其他人的博客
如果从零开始搭建一个个人博客，还是要涉及很多知识的，不利于新手的学习，所以我们可以克隆其他人的站点，再加以修改，可以节省很多学习成本。
以我自己的博客为例：[https://github.com/sqmax.github.io](https://github.com/sqmax.github.io),克隆到本地，将该目录下除.git目录的所有文件和目录拷贝到你自己的本地博客站点目录下，然后将所添加的内容push到github仓库,之后就可以到浏览器地址栏输入你的博客地址：`https://XXX.github.io`来进入个人博客网站了。

## 申请一个自己喜欢的域名
可以到[阿里云](https://wanwang.aliyun.com/domain/)申请域名,并购买，购买之后，我们ping一下自己主页的ip,在命令行注入：`ping sqmax.github.io`,注意sqmax是个人的github帐号。		

![](http://wx1.sinaimg.cn/large/0072Njp2ly1fo5ucm8bizj30kg02taaj.jpg)		

然后还要在[阿里云的域名控制台](https://netcn.console.aliyun.com/core/domain/list?spm=5176.2020520001.0.0.aM1oA2)解析域名。		

![](http://wx2.sinaimg.cn/large/0072Njp2ly1fo5u9esz84j30vc04bt93.jpg)		


* * *
![](http://wx3.sinaimg.cn/large/0072Njp2ly1fo5uhtvxdpj30kp0b83z0.jpg)		

注意这里记录类型选“A”,主机记录我填的是www，这里www是一个二级域名，@或者不填是一级域名，记录值填的就是刚才ping出来的id,这样就把我们自己申请购买的域名和github pages默认的域名`sqmax.github.io`关联起来了。
最后，在sqmax.github.io目录下建一个名字叫CNAME的纯文本文件（注意无后缀名），将申请的域名（`www.sqmax.top`）写在里面即可，然后再将新加入的文件push到github远程仓库。
这时我们打开浏览器，在地址栏输入：`http://www.sqmax.top`,就可以访问自己的博客站点了。

![](http://wx1.sinaimg.cn/large/0072Njp2ly1fo5ulbsywgj30s80kowjj.jpg)		


## 参考文章

* [http://blog.csdn.net/yanzhenjie1003/article/details/51703370](http://blog.csdn.net/yanzhenjie1003/article/details/51703370)
* [https://gaohaoyang.github.io/2015/02/15/create-my-blog-with-jekyll/](https://gaohaoyang.github.io/2015/02/15/create-my-blog-with-jekyll/)























