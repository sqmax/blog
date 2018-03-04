---
layout: post
title:  "Spring(1)-SpringIoC"
categories: Spring
tags:  Spring IoC DI
author: SqMax
---

* content
{:toc}

Spring框架的核心理念是IoC（控制反转）和AOP（面向切面编程），其中IoC是Spring框架的基础，而AOP则是其重要的功能。本文主要谈SpringIoC。控制反转也称DI（依赖注入），我觉得依赖注入更形象，所以我更喜欢称为依赖注入。

## DI功能是如何实现的

因为任何一个有实际意义的应用都会后两个以上的类组成，这些类相互之间进行协助来完成特定的业务逻辑。按照传统的做法，每个对象负责管理与自己协助的对象（即它所依赖的对象)，这将导致高度耦合和难以测试的代码。





下面借用《Spring实战4》的一个例子，很生动地说明了DI的基本原理。

### 首先我们建立一个骑士Knight接口。

```java
public interface Knight {
  void embarkOnQuest();
}
```

然后有一个DamselRescuingKnight类，它只能执行RescueDamselQuest探险任务。

```java
public class DamselRescuingKnight implements Knight {
  private RescueDamselQuest quest;
  public DamselRescuingKnight() {
    this.quest = new RescueDamselQuest();
  }
  public void embarkOnQuest() {
    quest.embark();
  }
}
```

可以看到，DamselRescuingKnight在它的构造函数中自行创建了RescueDamselQuest。这使得DamselRescuingKnight紧密地和RescueDamselQuest耦合到了一起，因此极大地限制了这个骑士执行探险的能力。如果一个少女需要救援，这个骑士能够召之即来。但是如果一条恶龙需要杀掉，那么这个骑士就爱莫能助了。更糟糕的是，为这个DamselRescuingKnight编写单元测试将出奇地困难。在这样的一个测试中，你必须保证当骑士的embarkOnQuest()方法被调用的时候，探险的embark()方法也要被调用。但是没有一个简单明了的方式能够实现这一点。很遗憾，DamselRescuingKnight将无法进行测试。

耦合具有两面性。一方面，紧密耦合的代码难以测试、难以复用、难以理解，并且典型地表现出“打地鼠”式的bug特性（修复一个bug，将会出现一个或者更多新的bug）。另一方面，一定程度的耦合又是必须的——完全没有耦合的代码什么也做不了。为了完成有实际意义的功能，不同的类必须以适当的方式进行交互。总而言之，耦合是必须的，但应当被小心谨慎地管理。

通过DI，对象的依赖关系将由系统中负责协调各对象的第三方组件在创建对象的时候进行设定。对象无需自行创建或管理它们的依赖关系。

### 不再主动创建任务

下面进行改造骑士，使其不再主动创建任务。

```java
public class BraveKnight implements Knight {
	private Quest quest;
	public BraveKnight(Quest quest) {
		this.quest = quest;
	}
	public void embarkOnQuest() {
		quest.embark();
	}
}
```
我们可以看到，不同于之前的DamselRescuingKnight，BraveKnight没有自行创建探险任务，而是在构造的时候把探险任务作为构造器参数传入。这是依赖注入的方式之一，即构造器注入（constructor injection）。

更重要的是，传入的探险类型是Quest，也就是所有探险任务都必须实现的一个接口。所以，BraveKnight能够响应RescueDamselQuest、 SlayDragonQuest、 MakeRoundTableRounderQuest等任意的Quest实现。

这里的要点是BraveKnight没有与任何特定的Quest实现发生耦合。对它来说，被要求挑战的探险任务只要实现了Quest接口，那么具体是哪种类型的探险就无关紧要了。这就是DI所带来的最大收益——松耦合。如果一个对象只通过接口（而不是具体实现或初始化过程）来表明依赖关系，那么这种依赖就能够在对象本身毫不知情的情况下，用不同的具体实现进行替换。

### 将Quest注入到Knight中

现在BraveKnight类可以接受你传递给它的任意一种Quest的实现，但该怎样把特定的Query实现传给它呢？假设，希望BraveKnight所要进行探险任务是杀死一只怪龙，如下SlayDragonQuest是要注入到BraveKnight中的Quest实现。

```java
public class SlayDragonQuest implements Quest {
  private PrintStream stream;
  public SlayDragonQuest(PrintStream stream) {
    this.stream = stream;
  
  public void embark() {
    stream.println("Embarking on quest to slay the dragon!");
  }
}
```

我们可以看到，SlayDragonQuest实现了Quest接口，这样它就适合注入到BraveKnight中去了。与其他的Java入门样例有所不同，SlayDragonQuest没有使用System.out.println()，而是在构造方法中请求一个更为通用的PrintStream。这里最大的问题在于，我们该如何将SlayDragonQuest交给BraveKnight呢？又如何将PrintStream交给SlayDragonQuest呢？

创建应用组件之间协作的行为通常称为装配（wiring）。Spring有多种装配bean的方式，采用XML是很常见的一种装配方式。

下面是使用Spring将SlayDragonQuest注入到BraveKnight中的knight.xml配置文件。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.springframework.org/schema/beans 
      http://www.springframework.org/schema/beans/spring-beans.xsd">

  <bean id="knight" class="sia.knights.BraveKnight">
    <constructor-arg ref="quest" />
  </bean>

  <bean id="quest" class="sia.knights.SlayDragonQuest">
    <constructor-arg value="#{T(System).out}" />
  </bean>

</beans>
```

在这里，BraveKnight和SlayDragonQuest被声明为Spring中的bean。就BraveKnight bean来讲，它在构造时传入了对SlayDragonQuest bean的引用，将其作为构造器参数。同时，SlayDragonQuest bean的声明使用了Spring表达式语言（Spring Expression  Language），将System.out（这是一个PrintStream）传入到了SlayDragonQuest的构造器中。

DI所带来的好处是尽管BraveKnight依赖于Quest，但是它并不知道传递给它的是什么类型的Quest，也不知道这个Quest来自哪里。与之类似，SlayDragonQuest依赖于PrintStream，但是在编码时它并不需要知道这个PrintStream是什么样子的。只有Spring通过它的配置，能够了解这些组成部分是如何装配起来的。这样的话，就可以在不改变所依赖的类的情况下，修改依赖关系。

### 启动应用
现在已经声明了BraveKnight和Quest的关系，接下来我们只需要装载XML配置文件，并把应用启动起来。

Spring通过应用上下文（ApplicationContext）装载bean的定义并把它们组装起来。Spring应用上下文全权负责对象的创建和组装。Spring自带了多种应用上下文的实现，它们之间主要的区别仅仅在于如何加载配置。

因为knights.xml中的bean是使用XML文件进行配置的，所以选择ClassPathXmlApplicationContext作为应用上下文相对是比较合适的。该类加载位于应用程序类路径下的一个或多个XML配置文件。

```java
public class KnightMain {

  public static void main(String[] args) throws Exception {
    ClassPathXmlApplicationContext context = 
        new ClassPathXmlApplicationContext(
            "knight.xml");
    Knight knight = context.getBean(Knight.class);
    knight.embarkOnQuest();
    context.close();
  }
}
```

这里的main()方法基于knights.xml文件创建了Spring应用上下文。随后它调用该应用上下文获取一个ID为knight的bean。得到Knight对象的引用后,只需简单调用embarkOnQuest()方法就可以执行所赋予的探险任务了。注意这个类完全不知道我们的英雄骑士接受哪种探险任务,而且完全没有意识到这是由BraveKnight来执行的。只有knights.xml文件知道哪个骑士执行哪种探险任务。

通过上面示例我们可以对依赖注入进行了一个快速的了解。
