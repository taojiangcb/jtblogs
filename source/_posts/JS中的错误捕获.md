---
title: JS中的错误捕获
catalog: true
tags:
  - js
date: 2019-12-30 16:20:43
subtitle:
header-img:
---
# try catch 捕获
 可以捕获到同步代码的错误，但是异步的微任务或这宏任务就不可以了。 
 
# window.error
可以捕获到异步队列的任务异常，但是网络请求之类的异常捕获不到。get 请求捕获不到哦。 网络请求捕获不到，io错误之类的。
```

<img src ='./a.jpg'> get 请求捕获不到

window.onerror = function() {
    console.log(arguments);
    return true; //程序不要奔溃，继续往下执行  js 进程不要死掉
}
```

# window.addEventListener('unhandledrejection') 捕获
从 js 进程中捕获错误,可以捕获全面的错误信息
```
 window.addEventListener('unhandlerejection',e => {
    console.log(e);
    return true //不阻断 js 进程的运行。
 })
```

# Fundebug bug 监控工具


# 错误上报
1. 错误抽样
2. mongodb 
