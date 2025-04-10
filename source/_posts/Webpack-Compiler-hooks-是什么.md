---
title: Webpack Compiler.hooks 是什么
catalog: true
tags:
  - Webpack
date: 2025-04-10 18:35:10
subtitle:
header-img:
---



## 🧠 什么是 `compiler.hooks`？

`compiler.hooks` 是 Webpack 插件生命周期钩子的集合。你可以在这些钩子上注册函数，**在 Webpack 构建流程的各个阶段执行你的逻辑**。

> 插件核心逻辑：
> ```js
> compiler.hooks.<某个阶段>.tap('PluginName', (compilation) => { ... })
> ```

---

## 🧭 Webpack 生命周期关键阶段（compiler.hooks）

下面是几个最关键的生命周期钩子，按执行顺序分类整理👇

---

### 🟢 初始化阶段

| 钩子名 | 说明 |
|--------|------|
| `environment` | 环境初始化前触发（最早） |
| `initialize` | webpack 5 新增：配置处理完毕，准备创建 compiler 实例时触发 |
| `afterEnvironment` | 环境配置已加载，加载插件之前触发 |
| `entryOption` | `entry` 配置解析后触发 |

---

### 🔄 编译阶段（Compiler 创建 → Compilation 创建）

| 钩子名 | 说明 |
|--------|------|
| `beforeRun` | 编译器开始运行前触发（异步） |
| `run` | 调用 `webpack()` 启动时触发 |
| `watchRun` | 监听模式中，重新编译前触发 |
| `compile` | 每次编译开始时触发，传入参数是 `params`（模块工厂等） |
| `thisCompilation` | 每次 Compilation 对象创建时（*比 compilation 更早*） |
| `compilation` | 每次 Compilation 对象创建时（可以访问 chunk、module、asset 等） |

---

### 🏗️ 构建流程阶段（构建模块、生成资源）

| 钩子名 | 说明 |
|--------|------|
| `make` | 开始构建模块图时触发（是构建主流程最重要的钩子） |
| `afterCompile` | 所有模块构建完成，准备生成文件 |
| `emit` | 将文件输出到 output 目录前触发（可以操作最终文件） |
| `afterEmit` | 文件输出后 |

---

### ✅ 结束阶段

| 钩子名 | 说明 |
|--------|------|
| `done` | 编译完成（成功或失败）时触发 |
| `failed` | 编译失败时触发 |
| `watchClose` | 监听模式关闭时触发 |
| `shutdown` | Webpack 关闭前触发（如 dev-server 退出）|

---

## 🔧 示例：自定义插件使用钩子

```js
class MyPlugin {
  apply(compiler) {
    compiler.hooks.compile.tap('MyPlugin', (params) => {
      console.log('开始编译...');
    });

    compiler.hooks.emit.tapAsync('MyPlugin', (compilation, callback) => {
      console.log('即将写入文件...');
      callback();
    });

    compiler.hooks.done.tap('MyPlugin', (stats) => {
      console.log('编译完成！');
    });
  }
}
```

---

## 🧱 图示版本（构建流程时间线）

```
initialize
  ↓
environment → afterEnvironment → entryOption
  ↓
beforeRun → run / watchRun
  ↓
compile → thisCompilation → compilation → make → buildModules
  ↓
seal → optimize → emit → afterEmit
  ↓
done / failed → watchClose → shutdown
```

---

## 📌 总结

| 阶段 | 代表钩子 | 作用 |
|------|----------|------|
| 初始化 | `initialize`, `entryOption` | 插件和配置准备 |
| 编译前 | `beforeRun`, `run`, `watchRun` | 启动 webpack |
| 编译过程 | `compile`, `compilation`, `make` | 核心构建阶段 |
| 输出阶段 | `emit`, `afterEmit` | 控制输出资源 |
| 编译结束 | `done`, `failed` | 编译完成处理 |

