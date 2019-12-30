---
title: NodeJS stream 模块
catalog: true
tags:
  - NodeJs
date: 2019-12-30 16:00:40
subtitle:
header-img:
---

# Nodejs stream 模块

## 流的基本概念
起点到终点

流：逐段，大量数据，大文件
传统:一次性读取完毕，在处理

```
const rs = fs.createReadStream('data.txt');

//流的逐块传输
rs.on('data',chunk=>{
    data += chunk;
});
rs.on('end',()=>{
    console.log(data);
    console.log('读取成功')
})


//可写流
const ws = fs.createWriteStream('copy1.mp4')

//pipe姿势可读流的方法
rs.pipe(ws)
```

# 为什么要用流
优点：内存效率,时间效率
大文件进行逐块运输，压榨IO以及内存碎片。因为nodejs内存资源有限，而且请求大块连续内存，可以能就引起内存规整等系列问题性能效率极低。

# 流的类型
- 4中类型的流
    - 可读流
    - 可写流
    - 双工流-Duplex   比如: net.socket
    - transform 转换流 比如文件压缩，文件解压
    - 
stream对象都是 EventEmitter 的实例
有通用事件
- data
- end
- error

# 如何使用

### 可读流
```

const fs = fs.createReadStream('data.txt',{encoding:"utf8",highWaterMark:6)

//监听数据传输,块，buffer 二进制
//不停进行数据读取,触发data事件
//设置一个缓存区，大小默认16k hightWaterMark 
rs.on('data',chunk=>{
    ws.write(chunk)
})

rs.on('end',()=>{
    console.log('读取完毕')
})

rs.on("open",()=>{
    //文件打开
})

rs.on('close',()=>{
    文件关闭
})

rs.on('error',(err)=>{
    文件错误
})
```

> 可读流有两种模式 自动流flowing 模式,手动流paused模式
stream.read()

```
没有 rs.on('data' (chunk)=>{}) 事件

let on('readable',()=>{
    while((chunk = rs.read()) != null)) {
        data += chunk;
    }
})

```

### 可写流
 write()
 
### Duplex 
 read() write()    net.socket
 
 
 transform stream 转换流
 
 ```
 const trasform = stream.Trasform({
    transfrom(chunk,encode,cb) {
        this.push(chunk.toString())
        cb();
    }
 })
 ```

# 链式调用
 pipe();
 
 # 逐行读取最佳方案
 readling();
 
 
 ```
 const readStream = fs.createReadStream('filename')
 const readL = readLine.createInterface({input:readStream)
 
 readL.on('line',data=>{
    console.log(data);
 })
 
 readL.on('close',()=>{
     console.log('读取完成')
 });
 
 ```
