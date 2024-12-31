---
title: ioc4之小总结
catalog: true
tags:
  - js
date: 2020-02-07 18:57:45
subtitle:
header-img:
---
# Reflect Metadat
元编程，借助decorators装饰器在运行时动态修改接口的数据利用Reflect(元编程)给属性注入一些装饰器描述的数据和方法作为注入的基础铺垫

# inversify
基于 Reflect Metadata 反射 + 装饰器实现了注入依赖的接口

- @injectable 注入
- @inject 依赖翻转 = 反射实例 获取到注入的实例

- Container 容器隔离作用域，通过的容器的操作可以获取相关的注入实例

- Container.bind 对注入元素一一bind 之后容器才能使用相关的元素

# inversify-binding-decorators
对 inversify 进行跟高级的使用的api 封装

- @provide(实例id,force) 这个和 @injectable 差不多相等，区别在于 injectable 不能多次注入，而provide可以多次注入相同的实例，
- @fluentProvide(实例,别名),这个职称链式调用连续执行注入
- buildProviderModule 对容器进行 bind 操作,对打上@provide和@fluentProvide的装饰器对象一次性灌入到容器内，不需要--执行Container.bind操作

