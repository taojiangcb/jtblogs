---
title: Webpack 优化
catalog: true
tags:
  - Webpack
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
        
# webpack-bundle-analyzer 分析体积
```
npm install webpack-bundle-analyzer -D
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
plugins:[
    new BundleAnalyzerPlugin(),
]

```

构建完成后会在 8888 端口展示大小

一般推荐使用高版本的node和webpack，因为他们内部自己做了优化
    
# 使用 webpack4的原因
V8 带来的优化（for of 替代 forEach、Map 和 Set 替代 Object、includes 替代 indexOf）
默认使用更快的 md4 hash 算法
webpack AST 可以直接从 loader 传递给 AST，减少解析时间
使用字符串方法替代正则表达式

# 多进程/多实例构建：资源并行解析可选方案

```
npm install cache-loader thread-loader -D

```

使用 thread-loader 解析资源

原理：每次 webpack 解析一个模块，thread-loader 会将它及它的依赖分配给 worker 线程

```

module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                     {
                         loader: 'thread-loader',
                         options: {
                             workers: 3
                         }
                     },
                     'cache-loader',//使用cacheDirectory，可以缓存编译结果，避免多次重复编译；
                     'babel-loader',
                ]
        },            
    ]
 }

```

# 多进程/多实例：并行压缩

方式一：使用 parallel-uglify-plugin 插件

```
plugins:[
 new ParallelUglifyPlugin({
    uglifyJS:{
        output:{
            beautify:false,
            comments:false
        },
        compress:{
            warning:false,
            drop_console:true,
            collapse_vars:true,
            reduce_vars:true
        }
    }
 })
]

```

方式二：uglifyjs-webpack-plugin 开启 parallel 参数

```
plugins:[
 new UglifyJsPlugin({
    uglifyOptions:{
        warning:false
    },
    parallel:true
 })
]

```

方法三：terser-webpack-plugin 开启 parallel 参数

optimization:{
    minimizer:[
        new TerserPlugin({
            parallel:4
        })
    ]
}

# 缩小构建目标
目的：尽可能的少构建模块

比如 babel-loader 不解析 node_modules

```
rules: [
            {
                test: /\.js$/,
                exclude: 'node_modules',//忽略node_moudles，避免编译第三方库中已经被编译过的代码；
                use: [
                     'babel-loader',
                ]
            }
]

```

# 减少文件搜索范围
优化 resolve.extensions 配置

合理使用 alias

```
resolve: {
    alias: {
         'components': path.resolve(__dirname, './src/components'),
         'util': path.resolve(__dirname, './src/util'),
    },
    extensions: ['.js']
}


```

# noParse

在 webpack 中，我们需要使用的 loader 是在 module.rules 下配置的，webpack 配置中的 module 用于控制如何处理项目中不同类型的模块。

除了 module.rules 字段用于配置 loader 之外，还有一个 module.noParse 字段，可以用于配置哪些模块文件的内容不需要进行解析。对于一些不需要解析依赖（即无依赖） 的第三方大型类库等，可以通过这个字段来配置，以提高整体的构建速度。

> 使用 noParse 进行忽略的模块文件中不能使用 import、require、define 等导入机制。

```
module.exports = {
  // ...
  module: {
    noParse: /jquery|lodash/, // 正则表达式

    // 或者使用 function
    noParse(content) {
      return /jquery|lodash/.test(content)
    },
  }
}

```

# 图片压缩
使用：配置 image-webpack-loader

```

{
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: '[name]_[hash:8].[ext]'
                }
            },
            {
                loader: 'image-webpack-loader',
                options: {
                  mozjpeg: {
                    progressive: true,
                    quality: 65
                  },
                  optipng: {
                    enabled: false,
                  },
                  pngquant: {
                    quality: '65-90',
                    speed: 4
                  },
                  gifsicle: {
                    interlaced: false,
                  },
                  webp: {
                    quality: 75
                  }
        }
}

```

### 无用的 CSS 如何删除掉？
PurifyCSS: 遍历代码，识别已经用到的 CSS class 这个需要和 mini-css-extract-plugin 配合使用

也就是说先提取为css文件然后再使用PurifyCSS

```
npm install purgecss-webpack-plugin

const PurgecssPlugin = require('purgecss-webpack-plugin');
plugins:[
    new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
    }),
    new PurgecssPlugin({
        paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`,  { nodir: true }),
    })
]

```

# 构建体积优化
我们可以使用动态 Polyfill -> Polyfill Service

原理：识别 User Agent，下发不同的 Polyfill

如何使用动态 Polyfill service
polyfill.io 
官方提供的服务：(引入到index.html中)
```
<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>

```
### 体积优化总结

Scope Hoisting

Tree-shaking

公共资源分离

图片压缩

动态 Polyfill

### 基础库分离

思路：将 react、react-dom,axios,element-ui 基础包通过 cdn 引⼊，不打⼊ bundle 中

```
npm install html-webpack-externals-plugin -D

使⽤ html-webpackexternals-plugin

const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
plugins:[
    new HtmlWebpackExternalsPlugin({
                externals: [
                      {
                        module: 'react',
                        entry: 'cdn.com/react.min.js',
                        global: 'React',
                      },
                      {
                        module: 'axios',
                        entry: 'cdn.com/axios.min.js',
                        global: 'Axios',
                      },
                ]
    }),
]

```

### 利⽤ SplitChunksPlugin 进⾏公共脚本分离

SplitChunksPlugin是Webpack4 内置的，替代webpack3的CommonsChunkPlugin插件

async 异步引⼊的库进⾏分离(默认)

initial 同步引⼊的库进⾏分离

all 所有引⼊的库进⾏分离(推荐)

```
optimization: {
     splitChunks: {
        chunks: 'all',
        minSize: 30000,//抽离的公共包最小的大小
        maxSize: 0, //抽离的公共包最大的大小
        minChunks: 1, //一段代码多处都使用的次数 如果大于这里的次数就抽离成公共的文件
        maxAsyncRequests: 5,
        maxInitialRequests: 3,//浏览器同时请求的异步js的数量
        name: true,
        cacheGroups: {
            vendors: {
                test: /(axios|react)/,
                priority: -10,
                minChunks: 1
            }
        }
    }
 }

```

### treeShaking(摇树优化)
treeShaking(摇树优化)
概念：1 个模块可能有多个⽅法，只要其中的某个⽅法使⽤到了，则整个⽂件都会被打到bundle ⾥⾯去，tree shaking 就是只把⽤到的⽅法打⼊ bundle ，没⽤到的⽅法会在uglify 阶段被擦除掉。
使⽤：webpack4 默认⽀持，在 .babelrc ⾥设置 modules: false 即可
要求：必须是 ES6 的语法，CommonJS 的⽅式不⽀持.
production mode的情况下默认开启
treeShaking的情况:

```
代码执⾏的结果不会被⽤到

代码不会被执⾏，不可到达

代码只会影响死变量（只写不读）

```

Tree-shaking 原理
利⽤ ES6 模块的特点:

只能作为模块顶层的语句出现

import 的模块名只能是字符串常量

import binding 是 immutable的

代码擦除： uglify 
阶段删除⽆⽤代码

如果代码中有副作用则tree-shaking失效

可以在package.json中配置sideEffect:[] 比如babel-polyfill




### 使用scope hoisting消除大量闭包现象

原理：将所有模块的代码按照引⽤顺序放在⼀个函数作⽤域⾥，然后适当的重命名⼀些变量以防⽌变量名冲突

必须是 ES6 语法，CJS 不⽀持

```
plugins: [
 new webpack.optimize.ModuleConcatenationPlugin()
]

```

### 模块懒加载
webpack 有⼀个功能就是将你的代码库分割成chunks（语块），当代码运⾏到需要它们的时候再进⾏加载。

CommonJS：require.ensure

ES6：动态 import（⽬前还没有原⽣⽀持，需要 babel 转换）

#### 如何使⽤动态 import?
安装 babel 插件 ES6：动态 import（⽬前还没有原⽣⽀持，需要 babel 转换）

```
npm install @babel/plugin-syntax-dynamic-import --save-dev

{
    "plugins": ["@babel/plugin-syntax-dynamic-import"],
}

```

代码中的使用：

```
loadComponent() {
    import('./text.js').then((Text) => {
        this.setState({
            Text: Text.default
        });
    });
}

```

这样的话text.js在打包时就会被自动拆分为一个单独的文件，当我们调用这个方法时才进行加载，也算是一个优化手段

