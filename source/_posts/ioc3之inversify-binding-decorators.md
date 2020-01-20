---
title: ioc3之inversify-binding-decorators
catalog: true
tags:
  - js
date: 2020-01-20 11:56:08
subtitle:
header-img:
---

# provide

This small utility allows you to declare bindings using decorators:
> 这个小工具允许你声明绑定使用装饰:

```
import { injectable, Container } from "inversify";
import { provide, buildProviderModule } from "inversify-binding-decorators";
import "reflect-metadata";
 
@provide(Katana)
class Katana implements Weapon {
    public hit() {
        return "cut!";
    }
}
 
@provide(Shuriken)
class Shuriken implements ThrowableWeapon {
    public throw() {
        return "hit!";
    }
}
 
var container = new Container();
// Reflects all decorators provided by this package and packages them into 
// a module to be loaded by the container
//反映此包提供的所有装饰器，并将它们封装到要由容器装入的模块
container.load(buildProviderModule());
```



Using @provide multiple times
> If you try to apply @provide multiple times:
> 如果多次使用 provide:
```
@provide("Ninja")
@provide("SilentNinja")
class Ninja {
    // ...
}
```
The library will throw an exception:

 Cannot apply @injectable decorator multiple times. Please use @provide(ID, true) if you are trying to declare multiple bindings!

> 不能多次应用@injectable装饰器。如果您试图声明多个绑定，请使用@provide(ID, true) !

We throw an exception to ensure that you are are not trying to apply @provide multiple times by mistake.

You can overcome this by passing the force argument to @provide:
> 我们抛出一个异常，以确保您不会错误地多次尝试应用@provide。
您可以通过将force参数传递给@provide来克服这个问题:

```
@provide("Ninja", true)
@provide("SilentNinja", true)
class Ninja {
    // ...
}
```
Using classes, string literals & symbols as identifiers
When you invoke @provide using classes:

> 使用类、字符串和符号作为标识符
当您使用类调用@provide时:

```
@provide(Katana)
class Katana {
    public hit() {
        return "cut!";
    }
}
 
@provide(Ninja)
class Ninja {
    private _katana: Weapon;
    public constructor(
        katana: Weapon
    ) {
        this._katana = katana;
    }
    public fight() { return this._katana.hit(); };
}
```
A new binding is created under the hood:
> 创建一个新的覆盖

```
container.bind<Katana>(Katana).to(Katana);
container.bind<Ninja>(Ninja).to(Ninja);
```

These bindings use classes as identidiers but you can also use string literals as identifiers:

> 也可以使用字符作为 identifiers：

```
let TYPE = {
    IKatana: "Katana",
    INinja: "Ninja"
};
 
@provide(TYPE.Katana)
class Katana implements Weapon {
    public hit() {
        return "cut!";
    }
}
 
@provide(TYPE.Ninja)
class Ninja implements Ninja {
 
    private _katana: Weapon;
 
    public constructor(
        @inject(TYPE.Katana) katana: Weapon
    ) {
        this._katana = katana;
    }
 
    public fight() { return this._katana.hit(); };
 
}
```

You can also use symbols as identifiers:
> 也可以使用 symbols 作为 identifiers:

```
let TYPE = {
    Katana: Symbol("Katana"),
    Ninja: Symbol("Ninja")
};
 
@provide(TYPE.Katana)
class Katana implements Weapon {
    public hit() {
        return "cut!";
    }
}
 
@provide(TYPE.Ninja)
class Ninja implements Ninja {
 
    private _katana: Weapon;
 
    public constructor(
        @inject(TYPE.Katana) katana: Weapon
    ) {
        this._katana = katana;
    }
 
    public fight() { return this._katana.hit(); };
 
}
```

# Fluent binding decorator

The basic @provide decorator doesn't allow you to declare contextual constraints, scope and other advanced binding features. However, inversify-binding-decorators includes a second decorator that allows you to achieve access the full potential of the fluent binding syntax:

> 基本的@provide装饰器不允许声明上下文约束、范围和其他高级绑定功能。但是，inversify-binding-decorator包含第二个decorator，它允许您访问连贯绑定语法的全部潜力:

```
import { injectable, Container } from "inversify";
import { fluentProvide, buildProviderModule } from "inversify-binding-decorators";
 
let TYPE = {
    Weapon : "Weapon",
    Ninja: "Ninja"
};
 
@fluentProvide(TYPE.Weapon).whenTargetTagged("throwable", true).done();
class Katana implements Weapon {
    public hit() {
        return "cut!";
    }
}
 
@fluentProvide(TYPE.Weapon).whenTargetTagged("throwable", false).done();
class Shuriken implements Weapon {
    public hit() {
        return "hit!";
    }
}
 
@fluentProvide(TYPE.Ninja).done();
class Ninja implements Ninja {
 
    private _katana: Weapon;
    private _shuriken: Weapon;
 
    public constructor(
        @inject(TYPE.Weapon) @tagged("throwable", false) katana: Weapon,
        @inject(TYPE.Weapon) @tagged("throwable", true) shuriken: ThrowableWeapon
    ) {
        this._katana = katana;
        this._shuriken = shuriken;
    }
 
    public fight() { return this._katana.hit(); };
    public sneak() { return this._shuriken.throw(); };
 
}
 
var container = new Container();
container.load(buildProviderModule());
```

One of the best things about the fluent decorator is that you can create aliases to fit your needs:

> 关于fluent decorator最好的一点是，您可以创建别名来满足您的需求:

```
let provideThrowable = function(identifier, isThrowable) {
    return provide(identifier)
              .whenTargetTagged("throwable", isThrowable)
              .done();
};
 
@provideThrowable(TYPE.Weapon, true)
class Katana implements Weapon {
    public hit() {
        return "cut!";
    }
}
 
@provideThrowable(TYPE.Weapon, false)
class Shuriken implements Weapon {
    public hit() {
        return "hit!";
    }
}
```

Another example:

```
let provideSingleton = function(identifier) {
    return provide(identifier)
              .inSingletonScope()
              .done();
};
 
@provideSingleton(TYPE.Weapon)
class Shuriken implements Weapon {
    public hit() {
        return "hit!";
    }
}
```

If you try to apply @provideFluent multiple times:
> 如果多次使用 provideFluent 

```
let container = new Container();
let provideFluent = fluentProvide(container);
 
const provideSingleton = (identifier: any) => {
    return provideFluent(identifier)
    .inSingletonScope()
    .done();
};
 
function shouldThrow() {
    @provideSingleton("Ninja")
    @provideSingleton("SilentNinja")
    class Ninja {}
    return Ninja;
}
```
> 不能多次应用@provideFluent装饰器，但在Ninja中多次使用过，如果您试图声明多个绑定，请使用done(true) !

```
const provideSingleton = (identifier: any) => {
    return provideFluent(identifier)
    .inSingletonScope()
    .done(true); // IMPORTANT!(重要)
};
 
function shouldThrow() {
    @provideSingleton("Ninja")
    @provideSingleton("SilentNinja")
    class Ninja {}
    return Ninja;
}
let container = new Container();
container.load(buildProviderModule());
```

# The auto provide utility

This library includes a small utility apply to add the default @provide decorator to all the public properties of a module:

Consider the following example:

> 这个库包含一个小的实用程序apply，用于将默认的@provide装饰器添加到模块的所有公共属性中:

考虑下面的例子:

```
import * as entites from "../entities";
 
let container = new Container();
autoProvide(container, entites);
let warrior = container.get(entites.Warrior);
expect(warrior.fight()).eql("Using Katana...");

```

The contents of the entities.ts file are the following:

```
export { default as Warrior } from "./warrior";
export { default as Katana } from "./katana";

```

The contents of the katana.ts file are the following:

```
class Katana {
    public use() {
        return "Using Katana...";
    }
}
 
export default Katana;
```

The contents of the warrior.ts file are the following:

```
import Katana from "./katana";
import { inject } from "inversify";
 
class Warrior {
    private _weapon: Weapon;
    public constructor(
        // we need to declare binding because auto-provide uses
        // @injectbale decorator at runtime not compilation time
        // in the future maybe this limitation will desapear
        // thanks to design-time decorators or some other TS feature
        @inject(Katana) weapon: Weapon
    ) {
        this._weapon = weapon;
    }
    public fight() {
        return this._weapon.use();
    }
}
 
export default Warrior;
```