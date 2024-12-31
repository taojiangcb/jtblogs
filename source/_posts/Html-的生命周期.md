---
title: Html 的生命周期
catalog: true
tags:
  - js
date: 2021-09-05 16:10:15
subtitle:
header-img:
---

# GlobalEventHandlers
其实就是浏览器开放处理的全局 api 事件 经过业务整理构成了所谓的生命周期
 https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers

# 页面的生命周期
- DOMContentLoaded — 浏览器已经完全加载了HTML，DOM树已经构建完毕，但是像是 <img> 和样式表等外部资源可能并没有下载完毕。
- load — 浏览器已经加载了所有的资源（图像，样式表等）。
- beforeunload/unload -- 当用户离开页面的时候触发。

JS 会阻碍 dom 的构建 css 会阻塞js 的执行 所以可以利用 async 和defer

- 带有async的脚本是优先执行先加载完的脚本，他们在页面中的顺序并不影响他们执行的顺序。	
- 带有defer的脚本按照他们在页面中出现的顺序依次执行。

DOMContentLoaded
 - 带有async的脚本也许会在页面没有完全下载完之前就加载，这种情况会在脚本很小或本缓存，并且页面很大的情况下发生。	
 - 带有defer的脚本会在页面加载和解析完毕后执行，刚好在DOMContentLoaded之前执行。

# readyState
 document.readyState属性给了我们加载的信息，有三个可能的值：
  - loading 加载 - document仍在加载。
  - interactive 互动 - 文档已经完成加载，文档已被解析，但是诸如图像，样式表和框架之类的子资源仍在加载。
  - complete - 文档和所有子资源已完成加载。状态表示 load 事件即将被触发。

有一些情况我们无法确定页面上是否已经加载完毕，比如一个带有async的外部脚本的加载和执行是异步的（注：执行并不是异步的-_-）。在不同的网络状况下，脚本有可能是在页面加载完毕后执行也有可能是在页面加载完毕前执行，我们无法确定。所以我们需要知道页面加载的状况。

```
function work() { /*...*/ }
if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', work);
} else {
  work();
}
```

每当文档的加载状态改变的时候就有一个readystatechange事件被触发，所以我们可以打印所有的状态。

```
// current state
console.log(document.readyState);
// print state changes
document.addEventListener('readystatechange', () => console.log(document.readyState));
```

# 总结
 - 在 DOMContentLoaded 之后我没就可以通过 js 访问 dom 元素
 - 使用 async 和 defer 异步加载执行可以优化 html 的渲染效率 
 - document.readState 是当前状态，可以使用 readystatechange 中追踪页面的变化状态