---
title: Webpack sideEffect
catalog: true
tags:
  - Webpack
date: 2025-04-10 18:31:37
subtitle:
header-img:
---
**直观感受 `sideEffects` 到底起了什么作用**，特别是它和 Tree Shaking 是怎么配合的。

---

## ✅ 目标：对比有无 `sideEffects` 配置时，Tree Shaking 的行为差异

---

## 🔧 项目结构

```
demo/
├── package.json
├── src/
│   ├── index.js
│   ├── utils.js
│   └── style.css
```

---

## 📦 1. `package.json` 示例

```json
{
  "name": "tree-shaking-demo",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/bundle.js",
  "sideEffects": ["./src/style.css"], // 示例①：只保留有副作用的 style.css
  "scripts": {
    "build": "webpack --mode=production"
  }
}
```

> 可以切换为 `"sideEffects": false` 或完全去掉该字段来测试效果差异。

---

## 📁 2. `src/utils.js`

```js
export function pureFunction() {
  console.log("✅ I am pure and unused.");
}

export function usedFunction() {
  console.log("✅ I am used.");
}
```

---

## 📁 3. `src/style.css`

```css
body {
  background-color: pink;
}
```

> 引入后会影响页面样式，属于 **副作用模块**。

---

## 📁 4. `src/index.js`

```js
import './style.css'; // 仅用于样式
import { usedFunction, pureFunction } from './utils.js';

usedFunction();
// pureFunction 未被调用
```

---

## 📦 5. `webpack.config.js`

```js
import path from 'path';

export default {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve('dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  mode: 'production'
};
```

---

## 🚀 实验步骤：

### ✅ 实验 A：设置 `"sideEffects": false`

```json
"sideEffects": false
```

- ✔️ `pureFunction` 没用到 → 会被摇掉
- ❌ `style.css` 也会被摇掉！导致样式丢失！😱

---

### ✅ 实验 B：设置 `"sideEffects": ["./src/style.css"]`

```json
"sideEffects": ["./src/style.css"]
```

- ✔️ `pureFunction` 没用到 → 会被摇掉
- ✔️ 样式 `style.css` 会保留

---

### ✅ 实验 C：不设置 `sideEffects` 字段（即默认 `true`）

```json
// package.json 没有 sideEffects 字段
```

- ❌ 所有模块默认认为有副作用 → `pureFunction` 也不会被摇掉
- ❌ Tree Shaking 无法正常进行，bundle 体积变大

---

## 📌 总结一句话：

> `sideEffects` 告诉 Webpack：“我可以安全地移除这些模块，如果它们没被用到的话。”

| 配置 | 会摇掉未用代码？ | 会保留样式？ |
|------|------------------|---------------|
| `sideEffects: false` | ✅ 是 | ❌ 否 |
| `sideEffects: ["./src/style.css"]` | ✅ 是 | ✅ 是 |
| 不设置 | ❌ 否 | ✅ 是（但体积大） |
