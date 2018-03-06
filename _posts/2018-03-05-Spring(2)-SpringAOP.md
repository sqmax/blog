---
layout: post
title:  "Spring(2)-SpringAOP"
categories: Spring
tags:  Spring AOP
author: SqMax
---

* content
{:toc}

上节学习了Spring的核心-IoC的概念,这节就介绍一下Spring的另一个重要的功能-AOP（面向切面编程）。

## AOP是如何实现的

IoC能够让相互协作的软件组件保持松散耦合，而面向切面编程（AOP)允许你把遍布应用各处的功能分离出来形成可重用的组件。

面向切面编程往往被定义为促使软件系统实现关注点的分离的一项技术。系统由许多不同的组件组成，每一个组件各负责一块特定功能。除了实现自身核心的功能之外，这些组件还经常承担着额外的职责。诸如日志、事务管理和安全这样的系统服务经常融入到自身具有核心业务逻辑的组件中去，这些系统服务通常被称为横切关注点，因为它们会跨越系统的多个组件。




如果将这些关注点分散到多个组件中去，你的代码将会带来双重的复杂性。

* 实现系统关注点功能的代码将会重复出现在多个组件中这意味着如果你要改变这些关注点的逻辑，必须修改各个模块中的相关实现。即使你把这些关注点抽象为一个独立的模块，其他模块只是调用它的方法，但方法的调用还是会重复出现在各个模块中。
* 组件会因为那些与自身核心业务无关的代码而变得混乱。一个向地址簿增加地址条目的方法应该只关注如何添加地址，而不应该关注它是不是安全的或者是否需要支持事务。

![](http://wx3.sinaimg.cn/large/0072Njp2ly1fp2bfd69p2j30eo0b174x.jpg)

上图展示了这种复杂性。左边的业务对象与系统级服务结合得过于紧密。每个对象不但要知道它需要记日志、进行安全控制和参与事务，还要亲自执行这些服务。

### 使用AOP使服务模块化

AOP能够使这些服务模块化，并以声明的方式将它们应用到它们需要影响的组件中去。这些组件会具有更高的内聚性并且会更加关注自身的业务，完全不需要了解涉及系统服务所带来复杂性。总之，AOP能够确保POJO的简单性。

如图下图所示，我们可以把切面想象为覆盖在很多组件之上的一个外壳,应用是由那些实现各自业务功能的模块组成的。借助AOP，可以使用各种功能层去包裹核心业务层。这些层以声明的方式灵活地应用到系统中，你的核心应用甚至根本不知道它们的存在。这是一个非常强大的理念，可以将安全、事务和日志关注点与核心业务逻辑相分离。

![](http://wx4.sinaimg.cn/mw690/0072Njp2ly1fp2bfgvdfbj30d508bdfw.jpg)

为了示范在Spring中如何应用切面，让我们重新回到上节骑士的例子，并为它添加一个切面。

每一个人都熟知骑士所做的任何事情，这是因为吟游诗人用诗歌记载了骑士的事迹并将其进行传唱。假设我们需要使用吟游诗人这个服务类来记载骑士的所有事迹。下面程序展示了我们会使用的Minstrel类。

```java
public class Minstrel {

  private PrintStream stream;
  
  public Minstrel(PrintStream stream) {
    this.stream = stream;
  }

  public void singBeforeQuest() {
    stream.println("Fa la la, the knight is so brave!");
  }

  public void singAfterQuest() {
    stream.println("Tee hee hee, the brave knight " +
    		"did embark on a quest!");
  }

}
```

正如你所看到的那样，Minstrel是只有两个方法的简单类。在骑士执行每一个探险任务之前，singBeforeQuest()方法会被调用；在骑士完成探险任务之后，singAfterQuest()方法会被调用。在这两种情况下，Minstrel都会通过一个PrintStream类来歌颂骑士的事迹，这个类是通过构造器注入进来的。

把Minstrel加入你的代码中并使其运行起来，这对你来说是小事一桩。我们适当做一下调整从而让BraveKnight可以使用Minstrel。如下程序展示了将BraveKnight和Minstrel组合起来的第一次尝试。

```java
public class BraveKnight implements Knight {

	private Quest quest;
	private Minstrel minstrel;

	public BraveKnight(Quest quest, Minstrel minstrel) {
		this.quest = quest;
		this.minstrel = minstrel;
	}
	public void embarkOnQuest() {
		minstrel.singBeforeQuest();
		quest.embark();
		minstrel.singAfterQuest();
	}
}
```

这里BraveKnight必须要调用Minstrel的方法。

这应该可以达到预期效果。现在，你所需要做的就是回到Spring配置中，声明Minstrel bean并将其注入到BraveKnight的构造器之中。但是，请稍等……

我们似乎感觉有些东西不太对。管理他的吟游诗人真的是骑士职责范围内的工作吗？在我看来，吟游诗人应该做他份内的事，根本不需要骑士命令他这么做。毕竟，用诗歌记载骑士的探险事迹，这是吟游诗人的职责。为什么骑士还需要提醒吟游诗人去做他份内的事情呢？

此外，因为骑士需要知道吟游诗人，所以就必须把吟游诗人注入到BarveKnight类中。这不仅使BraveKnight的代码复杂化了，而且还让我疑惑是否还需要一个不需要吟游诗人的骑士呢？如果Minstrel为null会发生什么呢？我是否应该引入一个空值校验逻辑来覆盖该场景？

简单的BraveKnight类开始变得复杂，如果你还需要应对没有吟游诗人时的场景，那代码会变得更复杂。但利用AOP，你可以声明吟游诗人必须歌颂骑士的探险事迹，而骑士本身并不用直接访问Minstrel的方法。

### 声明切面
要将Minstrel抽象为一个切面，你所需要做的事情就是在一个Spring配置文件中声明它。下面程序是更新后的knight.xml文件，Minstrel被声明为一个切面。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:aop="http://www.springframework.org/schema/aop"
	xsi:schemaLocation="http://www.springframework.org/schema/aop 
      http://www.springframework.org/schema/aop/spring-aop.xsd
		http://www.springframework.org/schema/beans 
      http://www.springframework.org/schema/beans/spring-beans.xsd">

	<!-- 声明 Minstrel bean -->
	<bean id="minstrel" class="sia.knights.Minstrel">
		<constructor-arg value="#{T(System).out}" />
	</bean>

	<aop:config>
		<!-- 定义切面 -->
		<aop:aspect ref="minstrel">
			<!-- 定义切点 -->
			<aop:pointcut id="embark" expression="execution(* *.embarkOnQuest(..))" />
			<!-- 声明前置通知 -->
			<aop:before pointcut-ref="embark" method="singBeforeQuest" />
			<!-- 声明后置通知 -->
			<aop:after pointcut-ref="embark" method="singAfterQuest" />
		</aop:aspect>
	</aop:config>

</beans>
```

这里使用了Spring的aop配置命名空间把Minstrel bean声明为一个切面。首先，需要把Minstrel声明为一个bean，然后在`<aop:aspect>`元素中引用该bean。为了进一步定义切面，声明（使用`<aop:before>`）在`embarkOnQuest()`方法执行前调用Minstrel的`singBeforeQuest()`方法。这种方式被称为前置通知（before advice）。同时声明（使用`<aop:after>`）在`embarkOnQuest()`方法执行后调用`singAfterQuest()`方法。这种方式被称为后置通知（after advice）。

在这两种方式中，`pointcut-ref`属性都引用了id为embark的切入点。该切入点是在前边的`<pointcut>`元素中定义的，并配置expression属性来选择所应用的通知。表达式的语法采用的是AspectJ的切点表达式语言。

现在Spring在骑士执行探险任务前后就会调用Minstrel的`singBeforeQuest()`和`singAfterQuest()`方法。

这就是我们需要做的所有的事情！通过少量的XML配置，就可以把Minstrel声明为一个Spring切面。

从上面的例子中，我们可以获得两个重要的观点。

首先，Minstrel仍然是一个POJO，没有任何代码表明它要被作为一个切面使用。当我们按照上面那样进行配置后，在Spring的上下文中，Minstrel实际上已经变成一个切面了。其次，也是最重要的，Minstrel可以被应用到BraveKnight中，而BraveKnight不需要显式地调用它。实际上，BraveKnight完全不知道Minstrel的存在。

通过上面的例子，形象的说明了SpringAOP的概念。

>这两节内容都是来自《Spring实战4》的总结。[源代码参见](https://github.com/sqmax/springlearning/tree/master/springIoC%26AOP/knight)
