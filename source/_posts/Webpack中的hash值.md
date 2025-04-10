---
title: Webpack中的hash值
catalog: true
tags:
  - Webpack
date: 2019-12-30 23:33:14
subtitle:
header-img:
---

# ⽂件哈希值
⽂件哈希值就是打包后输出的⽂件名的后缀

例如：3.bfb2172c.js app.d3635098.js

# ⽂件哈希值如何⽣成
- Hash：和整个项⽬的构建相关，只要项⽬⽂件有修改，整个项⽬构建的 hash 值就会更改

- Chunkhash：和 webpack 打包的 chunk 有关，不同的 entry 会⽣成不同的 chunkhash 值

- Contenthash：根据⽂件内容来定义 hash ，⽂件内容不变，则 contenthash 不变

# JS 的⽂件哈希设置
设置 output 的 filename，使⽤ [chunkhash]

```
output: {
    filename: '[name][chunkhash:8].js',
    path: __dirname + '/dist'
}

```

注意: chunkhash无法和热更新一起使用

# CSS 的⽂件哈希设置
设置 MiniCssExtractPlugin 的 filename，

使⽤ [contenthash]

```
npm install mini-css-extract-plugin -D

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
plugins: [
     new MiniCssExtractPlugin({
         filename: `[name][contenthash:8].css`
     });
]

```

如果想把css提取出来，那么style-loader就不能用了，因为两个是互斥的，所以我们可以这样写:

```
module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    - 'style-loader',
                    + MiniCssExtractPlugin.loader
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    - 'style-loader',
                    + MiniCssExtractPlugin.loader
                    'css-loader',
                    'less-loader'
                ]
            },
        ]
},
```

图片&字体文件哈希设置

```
module: {
rules: [
    {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
              loader: 'file-loader’,
              options: {
                 name: 'img/[name][hash:8].[ext] '
              }
        }]
    }
]

```

# 占位符介绍

- [ext] 资源名后缀
- [name] 文件名称
- [path] 文件的相对路径
- [folder] 文件所在的文件夹
- [contenthash] 文件的内容hash 默认md5生成
- [hash] 文件内容的hash 默认md5生成