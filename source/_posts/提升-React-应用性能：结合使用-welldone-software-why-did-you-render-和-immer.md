---
title: 提升 React 应用性能：结合使用 @welldone-software/why-did-you-render 和 immer
catalog: true
tags:
  - react
date: 2025-01-07 21:38:50
subtitle:
header-img:
---

## 提升 React 应用性能：结合使用 `@welldone-software/why-did-you-render` 和 `immer`

在现代 Web 开发中，性能优化是提升用户体验的关键因素之一。对于使用 React 的开发者来说，识别和解决不必要的组件重新渲染是优化性能的重要一步。今天，我们将介绍两个强大的工具，`@welldone-software/why-did-you-render` 和 `immer`，它们可以帮助我们识别并解决这个问题，从而大幅提升应用性能。

### 为什么选择 `@welldone-software/why-did-you-render`？

`@welldone-software/why-did-you-render` 是一个 React 的调试工具，能够帮助我们检测哪些组件在不必要地重新渲染，以及为什么会发生这些重新渲染。通过在控制台中提供详细的信息，我们可以找到性能瓶颈并进行针对性优化。

### 为什么选择 `immer`？

`immer` 是一个用于不可变状态管理的库。它允许我们在不直接修改状态的情况下创建新的状态，从而避免不必要的渲染。`immer` 提供了一个简单的 API，使得状态更新变得更加直观和易于管理。

### 安装

首先，安装所需的依赖：

```bash
npm install @welldone-software/why-did-you-render immer --save-dev
# 或者
yarn add @welldone-software/why-did-you-render immer --dev
```

### 配置 `@welldone-software/why-did-you-render`

在项目中创建一个新的文件 `wdyr.tsx` 并添加以下代码来启用 `@welldone-software/why-did-you-render`：

```tsx
import React from 'react';

// 仅在开发环境中启用
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    onlyLogs: true,
    titleColor: 'green',
    diffNameColor: 'darkturquoise',
    trackHooks: true,
    trackAllPureComponents: true,
  });
}
```

在项目入口文件（例如 `src/index.tsx`）中引入 `wdyr.tsx` 文件：

```tsx
import './wdyr'; // 必须在 React 之前引入
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
```

### 定义 `useImmer` hook

我们将定义一个通用的 `useImmer` hook 来简化状态管理：

```tsx
import { produce, Draft, freeze } from 'immer';
import { useCallback, useState } from 'react';

export type DraftFunction<S> = (draft: Draft<S>) => void;
export type Updater<S> = (arg: S | DraftFunction<S>) => void;
export type ImmerHook<S> = [S, Updater<S>];

// 函数签名
export function useImmer<S = unknown>(initialValue: S | (() => S)): ImmerHook<S>;

export function useImmer<T>(initialValue: T) {
  const [val, updateValue] = useState(() =>
    freeze(typeof initialValue === 'function' ? initialValue() : initialValue, true),
  );

  const updateDispatcher = useCallback((updater: Updater<T>) => {
    if (typeof updater === 'function') {
      updateValue(produce(updater));
    } else {
      updateValue(freeze(updater));
    }
  }, []);

  return [val, updateDispatcher];
}

export default useImmer;
```

### 实战示例：优化购物车应用

让我们通过一个简单的购物车应用，展示如何使用 `@welldone-software/why-did-you-render` 和 `immer` 来优化性能。

#### 优化前的代码

以下是一个未优化的购物车应用：

```tsx
import React, { useState } from 'react';

// 购物车项目组件
const CartItem = ({ item }) => {
  console.log('CartItem rendered');
  return (
    <div>
      <span>{item.name}</span>
      <span>{item.quantity}</span>
    </div>
  );
};
CartItem.whyDidYouRender = true;

// 购物车组件
const Cart = () => {
  const [cart, setCart] = useState([
    { id: 1, name: 'Apple', quantity: 2 },
    { id: 2, name: 'Banana', quantity: 5 },
  ]);

  const addItem = () => {
    setCart([...cart, { id: 3, name: 'Orange', quantity: 3 }]);
  };

  return (
    <div>
      {cart.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
      <button onClick={addItem}>Add Item</button>
    </div>
  );
};

export default Cart;
```

在这个未优化的代码中，每次添加商品时，整个购物车组件都会重新渲染，导致所有 `CartItem` 组件也会重新渲染。

#### 优化后的代码

现在，我们使用 `immer` 和 `useImmer` hook 来优化这个应用：

```tsx
import React from 'react';
import useImmer from './useImmer'; // 引入自定义的 useImmer hook

// 购物车项目组件
const CartItem = React.memo(({ item }) => {
  console.log('CartItem rendered');
  return (
    <div>
      <span>{item.name}</span>
      <span>{item.quantity}</span>
    </div>
  );
});
CartItem.whyDidYouRender = true;

// 购物车组件
const Cart = () => {
  const [cart, updateCart] = useImmer([
    { id: 1, name: 'Apple', quantity: 2 },
    { id: 2, name: 'Banana', quantity: 5 },
  ]);

  const addItem = () => {
    updateCart((draft) => {
      draft.push({ id: 3, name: 'Orange', quantity: 3 });
    });
  };

  return (
    <div>
      {cart.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
      <button onClick={addItem}>Add Item</button>
    </div>
  );
};

export default Cart;
```

在优化后的代码中，我们做了以下改进：
1. 使用 `useImmer` hook 来简化状态管理，并确保状态更新是不可变的。
2. 使用 `React.memo` 来避免不必要的渲染。

### 对比效果

通过 `@welldone-software/why-did-you-render`，你可以在控制台中清晰地看到优化前后的渲染情况。当添加商品时，优化后的代码只会重新渲染新增的 `CartItem` 组件，而不是重新渲染所有的 `CartItem` 组件。

### 总结

通过结合使用 `@welldone-software/why-did-you-render` 和 `immer`，我们可以有效地识别并解决 React 应用中的不必要渲染问题。这不仅提高了应用的性能，还使状态管理变得更加直观和易于维护。希望这个示例能帮助你更好地理解和使用这两个强大的工具，提升你的 React 应用性能！

