---
title: Webpack - 核心概念
catalog: true
tags:
  - webpack
date: 2019-12-30 23:29:39
subtitle:
header-img:
---
# 核心概念之 Entry
Entry 用来指定 webpack 的打包⼊口

### Entry 的⽤法
单⼊⼝：entry 是⼀个字符串

```
module.exports = {
    entry: './src/index.js'
};
```

多⼊⼝：entry 是⼀个对象

```
module.exports = {
    entry: {
        index: './src/index.js',
        manager: './src/manager.js'
    }
};
```

# 核⼼概念之 Output
Output ⽤来告诉 webpack 如何将编译后的⽂件输出到磁盘的指定路径

### Output 的⽤法：单⼊⼝配置

```
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js’,
        path: __dirname + '/dist'
    }
};
```

Output 的⽤法：多⼊⼝配置

```
module.exports = {
    entry: {
        app: './src/app.js',
        search: './src/search.js'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist'
    }
};

```

通过[name]占位符确保⽂件名称的唯⼀

# 核⼼概念之 Loader
本身是一个函数，接受源文件作为参数，返回转换的结果。

### 常⻅的 Loader 有哪些？
```
babel-loader, 将es6+语法转换为es3/es5语法
css-loader,
style-loader,
scss-loader, 
less-loader,
postcss-loader,
file-loader, 进行图片字体等资源的打包
ts-loader, 将ts转换为js
raw-loader 将文件以字符串形式导入
...

```
### Loader 的⽤法
```
const path = require('path');
module.exports = {
    output: {
        filename: 'bundle.js'
    },
    module: {
        rules: [
            { test: /\.js$/, use: 'babel-loader' }
        ]
    }
};

```
test 指定匹配规则

use 指定使⽤的 loader 名称

# 核⼼概念之 Plugins
插件⽤于 bundle ⽂件的优化，资源管理和环境变量注⼊ 作⽤于整个构建过程

常见的Plugins

```
CleanWebpackPlugin 清理构建目录
MiniCssExtractPlugin 将css从bundle文件里提取为一个独立的css文件
htmlWebpackPlugin 创建html去承载输出的bundle文件
UglifyWebpackPlgin 压缩js 去除console等指定语句
...

```

Plugins 的⽤法

```
const path = require('path');
module.exports = {
    output: {
        filename: 'bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({template:'./src/index.html'})
    ]
};

```
所有的插件都应放到plugins数组里

