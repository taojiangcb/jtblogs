---
title: Webpack 的生命周期
catalog: true
tags:
  - Webpack
date: 2025-04-10 18:33:59
subtitle:
header-img:
---


这个问题问得非常专业！Webpack 的执行过程是一个**多阶段的生命周期系统**，可以分为若干个阶段（phases）和周期（cycles）。理解这些执行阶段，有助于你更好地写插件、调试构建问题、优化性能。

---

## 🚀 一句话总结

> **Webpack 的执行周期由多个 Hook 生命周期阶段组成，每个阶段负责构建流程中的不同任务。**

---

## 🧱 Webpack 执行周期图（简化版）

```
初始化阶段（Initialization）
│
├── 环境准备：initialize → environment → afterEnvironment
│
├── 加载配置与插件：entryOption → afterPlugins
│
编译准备阶段（Compiler Setup）
│
├── run / watchRun
│
编译构建阶段（Compilation）
│
├── compile
│   ├── thisCompilation
│   ├── compilation
│   ├── make （创建依赖图）
│   ├── buildModule → finishModules
│   └── seal（优化 chunk 和 module）
│
资源输出阶段（Emit Assets）
│
├── emit
│   └── afterEmit
│
结束阶段（Done）
│
├── done / failed
└── watchClose / shutdown
```

---

## 🧩 各阶段详细说明

### 1️⃣ 初始化阶段（Initialization Phase）

| 生命周期 | 说明 |
|----------|------|
| `initialize` | Webpack CLI 创建 compiler 时触发 |
| `environment` | 设置 loader 解析、plugin 加载前 |
| `afterEnvironment` | 环境变量处理完成 |
| `entryOption` | 读取并处理 entry 配置 |
| `afterPlugins` | 所有插件已被挂载 |

📌 插件常在这一阶段挂钩 `apply(compiler)`。

---

### 2️⃣ 编译准备阶段（Compiler Phase）

| 生命周期 | 说明 |
|----------|------|
| `beforeRun` | 编译开始前调用（仅首次） |
| `run` | 正常构建时触发 |
| `watchRun` | 监听模式下，文件变化重新编译时触发 |

> 编译启动时的入口点。

---

### 3️⃣ 编译构建阶段（Compilation Phase）

这是 Webpack 的核心阶段！

| 生命周期 | 说明 |
|----------|------|
| `compile` | 构建过程开始，准备 Compilation 对象 |
| `thisCompilation` | 创建 Compilation 实例 |
| `compilation` | Compilation 实例创建后立即触发 |
| `make` | 构建模块图开始，依赖分析 |
| `buildModule` | 开始构建模块（会多次调用） |
| `seal` | 完成依赖图后，准备生成 chunk、优化 |

📌 插件可在这里修改 module、chunk、asset、依赖图结构等。

---

### 4️⃣ 输出资源阶段（Emit Phase）

| 生命周期 | 说明 |
|----------|------|
| `emit` | 开始写文件之前（可改输出内容） |
| `afterEmit` | 写完文件之后 |

📌 可用于生成额外文件、修改输出内容、记录日志。

---

### 5️⃣ 结束阶段（Done Phase）

| 生命周期 | 说明 |
|----------|------|
| `done` | 编译成功完成 |
| `failed` | 编译失败 |
| `watchClose` | 监听模式下关闭 |
| `shutdown` | Webpack 完整退出前（用于清理资源） |

---

## 🧪 每个周期内部都可能触发很多事件

比如：

```js
compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
  compilation.hooks.optimizeModules.tap('MyPlugin', () => {
    console.log('模块优化中');
  });

  compilation.hooks.processAssets.tap('MyPlugin', () => {
    console.log('输出资源处理');
  });
});
```

---

## 🔍 一个完整周期对照表

| 阶段 | Hook（常用） |
|------|--------------|
| 初始化 | `initialize`, `environment`, `entryOption`, `afterPlugins` |
| 编译准备 | `beforeRun`, `run`, `watchRun` |
| 编译构建 | `compile`, `compilation`, `make`, `buildModule`, `seal` |
| 输出资源 | `emit`, `afterEmit`, `processAssets` |
| 编译结束 | `done`, `failed`, `watchClose`, `shutdown` |

---

## 🎯 总结

Webpack 是事件驱动架构，核心流程是：

1. **创建 Compiler 实例**
2. **生成 Compilation 对象**
3. **构建依赖图**
4. **生成 chunk 与 asset**
5. **输出资源到磁盘**
6. **触发最终完成事件**

---