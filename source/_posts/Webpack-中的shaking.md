---
title: Webpack 中的shaking
catalog: true
tags:
  - Webpack
date: 2025-04-10 18:29:23
subtitle:
header-img:
---

这是个非常核心的问题！Webpack 的 Tree Shaking 是现代前端构建优化的关键特性之一，我们可以从 **策略、实现原理、优化决策依据** 三个维度来回答这个问题：

---

## 一、🌲 Tree Shaking 是什么？

Tree Shaking（摇树优化）是指在构建过程中**移除 JavaScript 中未使用（dead code）的代码**，从而减小打包体积、提升运行效率。

---

## 二、Webpack 中 Tree Shaking 的策略

Webpack 的 Tree Shaking 策略其实并不是直接去“找出哪些代码没用”，而是通过以下三个关键策略配合实现的：

### ✅ 1. **基于 ES Module 的静态结构分析**
- 只有 ES Module（`import/export`）具有**静态结构**，Webpack 才能在构建时分析依赖关系。
- CommonJS（`require/exports`）是动态的，不支持 Tree Shaking。

> ✅ 所以第一策略：**只对 ESM 模块进行 tree shaking**

---

### ✅ 2. **依赖于 `sideEffects` 字段的标注**

`package.json` 中的 `sideEffects` 字段告诉 Webpack 哪些文件是“纯的”，没有副作用。

```json
{
  "sideEffects": false
}
```

- 如果某个模块或导入被标记为无副作用（pure），并且没有被引用，那么 Webpack 就会放心地移除它。
- 如果你有某些 CSS 导入或者 polyfill 模块有副作用，就要排除：

```json
{
  "sideEffects": ["./src/styles.css", "./src/polyfill.js"]
}
```

> ✅ 第二策略：**需要 `sideEffects: false` 的配合使用**

---

### ✅ 3. **依赖 Terser / SWC 等压缩器进行 Dead Code Elimination**

Webpack 自身不会直接删除“未引用的变量”，它只是标记（标注为 `unused`），真正“摇掉”的过程是在压缩阶段完成的。

默认用的是 [`terser-webpack-plugin`](https://github.com/webpack-contrib/terser-webpack-plugin)：

- 会移除未使用的 import/export。
- 移除未执行的分支代码。
- 移除多余的函数声明。

> ✅ 第三策略：**通过压缩器来做最终 dead code 删除**

---

## 三、Tree Shaking 的优化决策依据

Webpack 在做 Tree Shaking 时，主要基于以下信息来判断是否可以移除代码：

| 决策依据 | 说明 |
|----------|------|
| ESM 的 `import` 是否被使用 | 如果导出的变量/函数/类没有被 import，用不到就可以摇掉 |
| `sideEffects: false` 标识 | 标记整个模块可以被移除 |
| 代码是否是纯函数或纯模块 | 如 `const a = 1;` 没有副作用，就可以移除 |
| Terser 等压缩器是否能确认其为 dead code | 分析作用域与引用链进行精准裁剪 |

---

## 四、实际案例分析

```js
// math.js
export const add = (a, b) => a + b;
export const sub = (a, b) => a - b;

// index.js
import { add } from './math.js';
console.log(add(1, 2));
```

**只使用了 `add`，没使用 `sub`，如果满足以下条件，`sub` 就会被 tree shake 掉：**

- 使用 `import`/`export`（不是 require）
- `package.json` 配了 `"sideEffects": false`
- 开启了 production 模式（Webpack 默认会压缩）

打包后的代码中，`sub` 不会存在！

---

## 五、注意事项和坑 ⚠️

| 问题 | 说明 |
|------|------|
| 使用 CommonJS 会导致 Tree Shaking 失效 | `require()` 无法静态分析 |
| 忽略 `sideEffects` 会导致副作用代码保留 | 必须标记清楚 |
| 动态导入/动态属性访问 | 比如 `obj[methodName]()` 会让压缩器放弃优化 |
| class 中未使用的静态方法不会自动移除 | 需要手动或使用 babel 插件（如 `babel-plugin-minify-dead-code-elimination`） |

---

## ✅ 总结

| 项目 | 说明 |
|------|------|
| 是否支持 | 仅支持 ES Module 模块 |
| 是否标记副作用 | `sideEffects: false` 是必要条件 |
| 是否生产模式 | 生产模式下会启用压缩器来最终删除代码 |
| 是否实际引用 | 仅保留被引用的 export，未引用的会被摇掉 |
