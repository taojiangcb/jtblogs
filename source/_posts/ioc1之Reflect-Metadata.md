---
title: ioc1之Reflect  Metadata
catalog: true
tags:
  - js
date: 2020-01-20 11:52:36
subtitle:
header-img:
---


# 基础
Reflect Metadata 是 ES7 的一个提案，它主要用来在声明的时候添加和读取元数据。TypeScript 在 1.5+ 的版本已经支持它，你只需要：

npm i reflect-metadata --save。
在 tsconfig.json 里配置 emitDecoratorMetadata 选项。
Reflect Metadata 的 API 可以用于类或者类的属性上，如：
```
function metadata(
  metadataKey: any,
  metadataValue: any
): {
  (target: Function): void;
  (target: Object, propertyKey: string | symbol): void;
};
```

Reflect.metadata 当作 Decorator 使用，当修饰类时，在类上添加元数据，当修饰类属性时，在类原型的属性上添加元数据，如：
```
@Reflect.metadata('inClass', 'A')
class Test {
  @Reflect.metadata('inMethod', 'B')
  public hello(): string {
    return 'hello world';
  }
}

console.log(Reflect.getMetadata('inClass', Test)); // 'A'
console.log(Reflect.getMetadata('inMethod', new Test(), 'hello')); // 'B'

```

# 获取类型信息
```
function Prop(): PropertyDecorator {
  return (target, key: string) => {
    const type = Reflect.getMetadata('design:type', target, key);
    console.log(`${key} type: ${type.name}`);
    // other...
  };
}
```
运行代码可在控制台看到 Aprop type: string。除能获取属性类型外，通过 Reflect.getMetadata("design:paramtypes", target, key) 和 Reflect.getMetadata("design:returntype", target, key) 可以分别获取函数参数类型和返回值类型。

# 自定义 metadataKey
除能获取类型信息外，常用于自定义 metadataKey，并在合适的时机获取它的值，示例如下：

```
function classDecorator(): ClassDecorator {
  return target => {
    // 在类上定义元数据，key 为 `classMetaData`，value 为 `a`
    Reflect.defineMetadata('classMetaData', 'a', target);
  };
}

function methodDecorator(): MethodDecorator {
  return (target, key, descriptor) => {
    // 在类的原型属性 'someMethod' 上定义元数据，key 为 `methodMetaData`，value 为 `b`
    Reflect.defineMetadata('methodMetaData', 'b', target, key);
  };
}

@classDecorator()
class SomeClass {
  @methodDecorator()
  someMethod() {}
}

Reflect.getMetadata('classMetaData', SomeClass); // 'a'
Reflect.getMetadata('methodMetaData', new SomeClass(), 'someMethod'); // 'b'

```

# 列子
## 控制反转和依赖注入

如果你在使用 TypeScript 开发 Node 应用，相信你对 Controller、Get、POST 这些 Decorator，并不陌生：
```
@Controller('/test')
class SomeClass {
  @Get('/a')
  someGetMethod() {
    return 'hello world';
  }

  @Post('/b')
  somePostMethod() {}
}

```


```
type Constructor<T = any> = new (...args: any[]) => T;

const Injectable = (): ClassDecorator => target => {};

class OtherService {
  a = 1;
}

@Injectable()
class TestService {
  constructor(public readonly otherService: OtherService) {}

  testMethod() {
    console.log(this.otherService.a);
  }
}

const Factory = <T>(target: Constructor<T>): T => {
  // 获取所有注入的服务
  const providers = Reflect.getMetadata('design:paramtypes', target); // [OtherService]
  const args = providers.map((provider: Constructor) => new provider());
  return new target(...args);
};

Factory(TestService).testMethod(); // 1
```

# Controller 与 Get 的实现
如果你在使用 TypeScript 开发 Node 应用，相信你对 Controller、Get、POST 这些 Decorator，并不陌生：

```
const METHOD_METADATA = 'method';
const PATH_METADATA = 'path';

//类装饰器
const controller = (path:string):ClassDecorator => {
    return target=> {
        Reflect.defineMetadata(PATH_METADATA,path,target);
    }
}

//方法装饰器，高阶函数
createMappingDecorator = (method:string) => (path:string):MethodDecorator=> {
    return(target,key,descriptor) => {
        Reflect.defineMetadata(PATH_METDATA,path,descriptor,value);
        Reflect.defineMetadata(METHOD_METADATA,method,descriotor,value);
    }
}

const GET = createMappingDecorator("Get");
const POST = createMappingDecorator("Post");
```
接着，创建一个函数，映射出 route：

```
function mapRoute(instance:Object) {
    const prototype = Object.getPrototypeOf(instance);
   // 筛选出类的 methodName
    const methodsNames = Object.getPropertyNames(prototype)
        .filter(item=>!isConstructor(item) && isFunction(prototype[item]));
    return methodsNames.map(methodName => {
        const fn = prototpe[methodName];
        const route = Reflect.getMetadata(PATH_METADATA,fn);
        const method = Reflect.getMetadata(PATH_METADATA,fn);
        return {
            route,method,fn,methodName
        }
    })
}
```

因此，我们可以得到一些有用的信息：

```
Reflect.getMetadata(PATH_METADATA, SomeClass); // '/test'
mapRoute(new SomeClass());

/**
 * [{
 *    route: '/a',
 *    method: 'GET',
 *    fn: someGetMethod() { ... },
 *    methodName: 'someGetMethod'
 *  },{
 *    route: '/b',
 *    method: 'POST',
 *    fn: somePostMethod() { ... },
 *    methodName: 'somePostMethod'
 * }]
 *
 */
```

最后，只需把 route 相关信息绑在 express 或者 koa 上就 ok 了。

