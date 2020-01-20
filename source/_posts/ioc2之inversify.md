---
title: ioc之inversify
catalog: true
tags:
  - js
date: 2020-01-20 11:54:57
subtitle:
header-img:
---
# 配置
⚠️重要!InversifyJS需要TypeScript >= 2.0，以及tsconfig中的实验者装饰器、emitDecoratorMetadata、类型和lib编译选项。json文件。

```
{
    "compilerOptions": {
        "target": "es5",
        "lib": ["es6"],
        "types": ["reflect-metadata"],
        "module": "commonjs",
        "moduleResolution": "node",
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
    }
}
```

# The Basics

### Step 1: Declare your interfaces and types

步骤1:声明接口和类型

Our goal is to write code that adheres to the dependency inversion principle. This means that we should "depend upon Abstractions and do not depend upon concretions". Let's start by declaring some interfaces (abstractions).

> 我们的目标是编写符合依赖倒置原则的代码。这意味着我们应该“依靠抽象而不依靠具体”。让我们首先声明一些接口(抽象)。

```
// file interfaces.ts
 
export interface Warrior {
    fight(): string;
    sneak(): string;
}
 
export interface Weapon {
    hit(): string;
}
 
export interface ThrowableWeapon {
    throw(): string;
}
```

InversifyJS need to use the type as identifiers at runtime. We use symbols as identifiers but you can also use classes and or string literals.

> InversifyJS 在运行时需要使用 type 作为identifiers 我们可以使用 symbols 也可使用string 或者 class

```
// file types.ts
 
const TYPES = {
    Warrior: Symbol.for("Warrior"),
    Weapon: Symbol.for("Weapon"),
    ThrowableWeapon: Symbol.for("ThrowableWeapon")
};
 
export { TYPES };
```

Note: It is recommended to use Symbols but InversifyJS also support the usage of Classes and string literals (please refer to the features section to learn more).

> 推荐使用 Symbol 

### Step 2: Declare dependencies using the @injectable & @inject decorators

步骤2:使用@injectable & @inject修饰符声明依赖关系

Let's continue by declaring some classes (concretions). The classes are implementations of the interfaces that we just declared. All the classes must be annotated with the @injectable decorator.

When a class has a dependency on an interface we also need to use the @inject decorator to define an identifier for the interface that will be available at runtime. In this case we will use the Symbols Symbol.for("Weapon") and Symbol.for("ThrowableWeapon") as runtime identifiers.

> 让我们继续声明一些类(具体)。这些类是我们刚才声明的接口的实现。所有的类都必须使用@injectable装饰器进行注释。

> 当一个类依赖于一个接口时，我们还需要使用@inject装饰器来定义一个在运行时可用的接口标识符。在本例中，我们将使用Symbol.for("Weapon")和Symbol.for("ThrowableWeapon")作为运行时标识符。

```
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { Weapon, ThrowableWeapon, Warrior } from "./interfaces"
import { TYPES } from "./types";
 
@injectable()
class Katana implements Weapon {
    public hit() {
        return "cut!";
    }
}
 
@injectable()
class Shuriken implements ThrowableWeapon {
    public throw() {
        return "hit!";
    }
}
 
@injectable()
class Ninja implements Warrior {
 
    private _katana: Weapon;
    private _shuriken: ThrowableWeapon;
 
    public constructor(
        @inject(TYPES.Weapon) katana: Weapon,
        @inject(TYPES.ThrowableWeapon) shuriken: ThrowableWeapon
    ) {
        this._katana = katana;
        this._shuriken = shuriken;
    }
 
    public fight() { return this._katana.hit(); }
    public sneak() { return this._shuriken.throw(); }
 
}
 
export { Ninja, Katana, Shuriken };

```
If you prefer it you can use property injection instead of constructor injection so you don't have to declare the class constructor:

> 如果你喜欢它，你可以使用属性注入代替构造函数注入，这样你就不必声明类构造函数:

```
@injectable()
class Ninja implements Warrior {
    @inject(TYPES.Weapon) private _katana: Weapon;
    @inject(TYPES.ThrowableWeapon) private _shuriken: ThrowableWeapon;
    public fight() { return this._katana.hit(); }
    public sneak() { return this._shuriken.throw(); }
}

```

### Step 3: Create and configure a Container

We recommend to do this in a file named inversify.config.ts. This is the only place in which there is some coupling. In the rest of your application your classes should be free of references to other classes.

> 我们建议在一个名为inversify.config.ts的文件中执行此操作。这是唯一存在耦合的地方。在应用程序的其余部分中，您的类应该没有对其他类的引用。

```
// file inversify.config.ts
 
import { Container } from "inversify";
import { TYPES } from "./types";
import { Warrior, Weapon, ThrowableWeapon } from "./interfaces";
import { Ninja, Katana, Shuriken } from "./entities";
 
const myContainer = new Container();
myContainer.bind<Warrior>(TYPES.Warrior).to(Ninja);
myContainer.bind<Weapon>(TYPES.Weapon).to(Katana);
myContainer.bind<ThrowableWeapon>(TYPES.ThrowableWeapon).to(Shuriken);
 
export { myContainer };
```

### Step 4: Resolve dependencies

步骤4:解决依赖关系

You can use the method get<T> from the Container class to resolve a dependency. Remember that you should do this only in your composition root to avoid the service locator anti-pattern.

> 您可以使用容器类中的get<T>方法来解决依赖项。请记住，您应该仅在组合根中执行此操作，以避免服务定位器反模式。

```
import { myContainer } from "./inversify.config";
import { TYPES } from "./types";
import { Warrior } from "./interfaces";
 
const ninja = myContainer.get<Warrior>(TYPES.Warrior);
 
expect(ninja.fight()).eql("cut!"); // true
expect(ninja.sneak()).eql("hit!"); // true
```