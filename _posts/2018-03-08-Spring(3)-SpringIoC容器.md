---
layout: post
title:  "Spring(3)-SpringIoC容器"
categories: Spring
tags:  Spring
---

* content
{:toc}

## SpringIoC容器

在了解了SpringIoC之后，我们来了解一下SpringIoC容器，SpringIoC容器负责对象的创建、装配，并管理它们的生命周期。SpringIoC容器的设计主要基于BeanFActory和ApplicationContext两个接口，其中ApplicationContext是BeanFactory的子接口之一，即BeanFactory是SpringIoC容器所定义的底层接口，而ApplicationContext是其高级接口之一，并且对BeanFactory功能做了许多有用的扩展，所以绝大部分情况下，都会使用ApplicationContext作为SpringIoC容器，下图展示了SpringIoC相关的IoC容器接口的主要设计。





![](http://wx1.sinaimg.cn/mw690/0072Njp2ly1fp5rcsvsjnj30lw0aq3yo.jpg)

附：[SpringAPI文档](https://docs.spring.io/spring/docs/5.0.4.RELEASE/javadoc-api/)

## Bean的生命周期

在传统的Java应用中,bean的生命周期很简单。使用Java关键字new进行bean实例化,然后该bean就可以使用了。一旦该bean不再被使用,则由Java自动进行垃圾回收。

相比之下,Spring容器中的bean的生命周期就显得相对复杂多了。正确理解Spring bean的生命周期非常重要,因为你或许要利用Spring提供的扩展点来自定义bean的创建过程。下图展示了bean装载到Spring应用上下文中的一个典型的生命周期过程。

![](http://wx2.sinaimg.cn/mw690/0072Njp2ly1fp5qmb6o9ej30hm0a3wg6.jpg)

正如你所见,在bean准备就绪之前,bean工厂执行了若干启动步骤。

1. Spring对bean进行实例化;
2. Spring将值和bean的引用注入到bean对应的属性中;
3. 如果bean实现了BeanNameAware接口,Spring将bean的ID传递给setBean-Name()方法;
4. 如果bean实现了BeanFactoryAware接口,Spring将调用setBeanFactory()方法,将BeanFactory容器实例传入;
5. 如果bean实现了ApplicationContextAware接口,Spring将调用setApplicationContext()方法,将bean所在的应用上下文的引用传入进来;
6. 如果bean实现了BeanPostProcessor接口,Spring将调用它们的post-ProcessBeforeInitialization()方法;
7. 如果bean实现了InitializingBean接口,Spring将调用它们的after-PropertiesSet()方法。类似地,如果bean使用init-method声明了初始化方法,该方法也会被调用;
8. 如果bean实现了BeanPostProcessor接口,Spring将调用它们的post-ProcessAfterInitialization()方法;
9. 此时,bean已经准备就绪,可以被应用程序使用了,它们将一直驻留在应用上下文中,直到该应用上下文被销毁;
10. 如果bean实现了DisposableBean接口,Spring将调用它的destroy()接口方法。同样,如果bean使用destroy-method声明了销毁方法,该方法也会被调用。

此外，要注意的是在上述生命周期的接口中，大部分是针对单个Bean而言的；BeanPostProcessor接口是针对所有的Bean。只要有一个Bean实现了上述接口，我们只需要在SpringIoC容器中定义它就可以了，SpringIoC容器会自动识别,其它Bean的生命周期就会按上图顺序执行BeanPostProcessor实现类中相应的方法。

下面结合例子说明。

首先是实现了DisposableBean的Bean

```java

public class DisposableBeanImpl implements DisposableBean {

	@Override
	public void destroy() throws Exception {
		System.out.println("调用接口DisposableBean的destroy方法");
	}
}
```
实现BeanPostProcessor的Bean

```java
public class BeanPostProcessorImpl implements BeanPostProcessor {

	@Override
	public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
		System.out.println("【" + bean.getClass().getSimpleName() + "】对象" + beanName + "开始实例化");
		return bean;
	}

	@Override
	public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
		System.out.println("【" + bean.getClass().getSimpleName() + "】对象" + beanName + "实例化完成");
		return bean;
	}

}

```

最后是JuiceMaker Bean，它实现了Bean生命周期的许多接口。

```java
public class JuiceMaker implements BeanNameAware, BeanFactoryAware, ApplicationContextAware, InitializingBean {
	private String beverageShop = null;
	private Source source = null;

	public JuiceMaker() {
		System.out.println("JuiceMaker初始化");
	}

	public String getBeverageShop() {
		System.out.println("getBeverage");
		return beverageShop;
	}

	public void setBeverageShop(String beverageShop) {
		System.out.println("setBevarage");
		this.beverageShop = beverageShop;
	}

	public Source getSource() {
		return source;
	}

	public void setSource(Source source) {
		System.out.println("setSource");
		this.source = source;
	}

	public String makeJuice() {
		String juice = "这是一杯由" + beverageShop + "饮品店，提供的" + source.getSize() + source.getSugar() + source.getFruit();
		return juice;
	}

	public void init() {
		System.out.println("【" + this.getClass().getSimpleName() + "】执行自定义初始化方法");
	}

	public void destroy() {
		System.out.println("【" + this.getClass().getSimpleName() + "】执行自定义销毁方法");
	}

	@Override
	public void setBeanName(String arg0) {
		System.out.println("【" + this.getClass().getSimpleName() + "】调用BeanNameAware接口的setBeanName方法");

	}

	@Override
	public void setBeanFactory(BeanFactory arg0) throws BeansException {
		System.out.println("【" + this.getClass().getSimpleName() + "】调用BeanFactoryAware接口的setBeanFactory方法");
	}

	@Override
	public void setApplicationContext(ApplicationContext arg0) throws BeansException {
		System.out.println(
				"【" + this.getClass().getSimpleName() + "】调用ApplicationContextAware接口的setApplicationContext方法");
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		System.out.println("【" + this.getClass().getSimpleName() + "】调用InitializingBean接口的afterPropertiesSet方法");
	}
}
```

下面是配置文件。

```xml
<?xml version='1.0' encoding='UTF-8' ?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://www.springframework.org/schema/beans 
	http://www.springframework.org/schema/beans/spring-beans-4.0.xsd">
	<!--BeanPostProcessor定义 -->
	<bean id="beanPostProcessor" class="com.ssm.chapter9.bean.BeanPostProcessorImpl" />

	<!--DisposableBean定义 -->
	<bean id="disposableBean" class="com.ssm.chapter9.bean.DisposableBeanImpl" />

	<bean id="source" class="com.ssm.chapter9.pojo.Source">
		<property name="fruit" value="橙汁" />
		<property name="sugar" value="少糖" />
		<property name="size" value="大杯" />
	</bean>
	
	<bean id="juiceMaker" class="com.ssm.chapter9.pojo.JuiceMaker"
		destroy-method="destroy" init-method="init">
		<property name="beverageShop" value="贡茶" />
		<property name="source" ref="source" />
	</bean>

</beans>
```

最后我们可以写个main方法测试一下。

```java
public class Chapter9Main {
	public static void main(String[] args) {
		testIoC();
	}
	public static void testIoC() {
		ClassPathXmlApplicationContext ctx = 
				new ClassPathXmlApplicationContext("spring-cfg.xml");
		JuiceMaker juiceMaker = (JuiceMaker) ctx.getBean("juiceMaker");
		System.out.println(juiceMaker.makeJuice());
		ctx.close();
	}
}
```
运行后，输出的日志如下：

![](http://wx4.sinaimg.cn/mw690/0072Njp2ly1fp5qm7pfz1j30ic0ah3z2.jpg)

这里我们关注一下JuiceMaker类执行的日志，就可以发现所有的生命周期的方法都已经被执行了，还可以看到BeanPostProcessor是针对所有Bean的，DisposableBean是最后在SpringIoC容器关闭前执行的。




