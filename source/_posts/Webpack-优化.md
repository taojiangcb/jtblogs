---
title: Webpack 优化
catalog: true
tags:
  - webpack
date: 2019-12-30 16:33:33
subtitle:
header-img:
---
# webpack 慢的原因
1. string -> ast -> string/buff,文件过多 n *  string -> ast -> string/buff
2. entry 过多 复杂 繁杂 fonts css js
3. async import(/***/'xxx.js') entry

# 解决方案
1. async 插件 speed-measure-webpack-plugin 
2. loader plugins cache-loader 开启线程
3. optimize-css-assets-webpack-plguin 开启进程 require('os').cups.leng - 1
4. 去 entry 多线程编译 使用 scripty 使用 linux 命令 接管 集群编译 
    1. 业务逻辑拆分,微前端的架构设计
    2. 准备几台机器,配置免密登录
    3. 通过远程机器 拉取 git 代码进行编译 让后推送回来(rsync 命令)
        ```
         ssh. xxx.xxx.xxx.deyploy.js
         ....
         ....
         async 回来
        ```
        
# 多页
 1. 需要配合 node 架设 bff 服务
    
# 单页
 spa 首页值出 

    
    
    



    

