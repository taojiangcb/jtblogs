---
title: css专业素养
catalog: true
date: 2019-12-29 23:07:17
subtitle:
header-img:
tags:
- css
---
cascading style sheet 

层叠样式表

1.引入css

```
 <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Document</title>
        <!--内部样式-->
        <style type="text/css">
            div{
                width:100px;
                height:100px;
                background-color:green;
            }
        </style>
        
        <!-- 外部引入 -->
        <link rel="stylesheet" href="lesson3.css",type="text/css" />
        
    </head>
    
    <body>
        <!-- 行间样式-->
        <div style="width:100px;height=100px;background-color:red;"></div>
    </body>
 </html>
```

lesson3.css
```
div{
    width:100px;
    height:100px;
    border-radius:50%;
    background-color:black;
}
```

下载策略
```
    1.浏览器 同时开始多个线性下载 文件
```

css 选择器
```
1. id选择器 --- 一一对应
<div id="only">123</div>

#only {
    background-color:red
}

2. class 选择器 ---- 多对多关系
<div class="demo"></div>
.demo { 
    background-color:"yellow" 
}

3.标签选择器
<div>123<div>

div{
    background-color:"black"
}

4.通配符选择器 (any 所有的标签)
<span>123</span>
<div>234</div>
<strong>1111</strong>

*{
    background-color:"green"
}

5.属性选择器
<div id="only" class="demo">123</div>
<div id="only1">234</div>

[id] {
    background-color:red
}

[id="only"] {
    background-color:red
}

6.!important 只能加载属性上，不能加在样式上
div{
    background-color:green!important 
}

7.父子选择器 （直接，间接都生效）
<div>
    <span>123123123</span>
</div>
<span>123123</span>

div span {
    background-color:red;
}

---------------------

<div class="wapper">
    <strong class="box">
        <em>234</em>
    <strong>
</div>

.wapper .box em{
    background-color:red
}


8.直接子元素选择器
<div>
    <em>1</em>
    <strong>
        <em>2</em>
    </strong>
<div>

div > em {
    background-color:green;
}

9.并列选择器
<div>1</div>
<div class="demo">2</div>
<p class="demo"></p>

div.demo{
    background-color:red;
}


10.分组选择器
<em></em>
<strong></strong>
<span></span>

em,strong,span {
    background-color:red
}

9.选择标签的优先级 important > 行间样式 > id选择器 > (class选择器 == 属性选择器) > 标签选择器 > 统配符选择器
<div id="only" class="demo"></div>
#only{
    background-color:red;
}

.demo{
    background-color:green;
}

```

css 自又向左选择顺序
```
selection div ul li a em {
    background-color:red
}
```

css 权重
```
!important
行间样式                256进制     1000
id                      256进制     100
class|属性|伪类         256进制     10
标签|微元素             256进制     1
通配符                              0


------------------
同一行样式定义权重相加
<div class="classDiv" id="idDiv"> 
    <p class="classP" id="idP"></p>
</div>

100   +  1
#idDiv p {
    background-color:red
}

10     +     10
.classDiv .classP {
    background-color:gren
}

```

==如果权重相等后来先到，后面会定义的会覆盖之前的==

复合使用例子
```
<div class="wrapper">
    <div class="content">
        <em class="box" id="only">1</em>
    </div>
</div>

#only {
    background-color:"red";
}

.content em {
    background-color:'green';
}

.wapper > .content > .box {
    background-color:'gray';
}

div.wrapper > div[class="content"] >div#only.box{
    background-color:blue
}

```

font 字体  
```
font-szie:50px;     其实是设置字体的高度   默认字号16
font-weigth:bolder, lighter,normal,100,200,300,400,500,600,700,800,900
font-style:italic;
font-family:arial;  //互联网通用字体


//画三角
width:0;
height:0;
border:100px solid black;
border-left-color:transparent;
border-top-color:transparent;
border-right-color:#00f;

```

# 盒子模型 层模型 习惯 企业开发经验
```
div {
    border:1px solder black;
   text-align:center;
   text-line:20px;                  //行高
   height:200px;    
   text-indent:2em;                 //首行文本缩减
}
```

```
span {
    text-decoration:node;underline;overline;
    color:rgb(0,0,238)
    cursor:pointer(小手);help(问号);e-resize
}
```

==1em = 1 * font-size; 该元素的font-size
line-height:1.2em   1.2 的行高==

伪类选择器
```
//鼠标悬浮
a:hover{
    background-color:red
}

//设置超链接a在其链接地址已被访问过时的样式
a:visited { }

设置元素在被用户激活（在鼠标点击与释放之间发生的事件）时的样式。
IE6,7只支持a元素的:active，从IE8开始支持其它元素的:active。
a:active { }

//设置对象在成为输入焦点（该对象的onfocus事件发生）时的样式。
webkit内核浏览器会默认给:focus状态的元素加上outline的样式。
input:facus {}

```

### 行级元素
```
feature: 内容决定元素所占的位置,不可以通过css改变宽高
span strong em a del

span{
    display:inline
}

```

### 块级元素
```
feature: 独占一行，可以通过css改变宽和高
div p ul li ol form address

div{
    display:block
}

```
### 行级块元素
```
feature: 内容决定大小
         可以改宽高
         
<img src='fy.jpg'/>

img{
    display:inline-block;
}

```

==凡是带有inline 的元素都有文字特性 带有文字分隔符== 
```
//去掉换行和空格
<img src="fy.jpg"/><img src="fy.jpg"/><img src="fy.jpg"/><img src="fy.jpg"/>
```
==先写css 后写html ==
1. css 先定义功能  css 工具库
2. 后选配功能
3. 标签选择器 初始化样式用的（自定义标签）
4. 通配符选择器最大的好处就是 初始化所有的标签 

### 盒子模型

1. 盒子的三大部分
- 盒子壁    border
- 内边距    padding
- 盒子模型  width + height;

##### 四个组成部分
外边距 | 边 | 内边距 | content
---|---|---|---
margin | border | padding | content

```
一个值:上下左右
padding:100px 
两个值 上下，左右
padding:100px 150px
三个值 上，左右，下
padding:100px 150px 100
四个值:上，有，下，左
padding:100px,100px,100px,100px

单值设置

padding-left:100px;
padding-right:100px;
padding-top:100px;
padding-bottom:100px;

```

### 怪异和模型 & 标准盒子模型详解
```
 box-sizing:content-box||border-box||inherit
 
 box-sizing:content-box 标准模式解析计算
 
 box-sizing:border-box
 将采用怪异和模型
 
```
### 弹性盒子模型
```
定义flex

display:flex|inline-flex(伸缩和模型最新版本)

display:box|inline-box(伸缩和模型老版本)

1.css columns 在弹性和模型中起不了作用
2.float clear 和vertical-align在flex中不起作用

### flex 布局
- content 包裹元素
  - flex-direction
    - flex-direction: row | row-reverse | column | column-reverse;
  - flex-wrap
    -   flex-wrap: nowrap | wrap | wrap-reverse;
  - flex-flow flex-flow属性是flex-direction属性和flex-wrap属性的简写形式，默认值为row nowrap。
    -   flex-flow: <flex-direction> <flex-wrap>;
  - justify-content justify-content属性定义了项目在主轴上的对齐方式。
    -   justify-content: flex-start | flex-end | center | space-between | space-around;
  - align-items align-items属性定义项目在交叉轴上如何对齐。(垂直对齐))
    - align-items: flex-start | flex-end | center | baseline | stretch;
  - align-content
    - align-content: flex-start | flex-end | center | space-between | space-around | stretch;

- item 子级元素
    - order
      -   order: <integer>; order属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。
    - flex-grow
      -   flex-grow: <number>; /* default 0 */ flex-grow属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。
    - flex-shrink
      -   flex-shrink: <number>; /* default 1 */ flex-shrink属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。
    - flex-basis
      -   flex-basis: <length> | auto; /* default auto */ 它可以设为跟width或height属性一样的值（比如350px），则项目将占据固定空间。
    - flex 以上三个元素的合并
      -   flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
    - align-self 自身覆盖 conent 元素的item-align 的属性可以以其他元素达到不一样的对齐方式
      -   align-self: auto | flex-start | flex-end | center | baseline | stretch;

```

==和模型的高宽不计算margin==
```
realW = border + padding + width
realH = border + padding + height
```

==body 有个默认的margin值 8 个像素==

# 层模型
### 定位 absolute
absolute 绝对定位 脱离原来位置从新定位

相对于最近的有定位的父级进行定位，否则相对于文档进行定位

```
div{
    position:absolute 
    top:100px                   顶部距离
    left:100px                  左边距离
    ========================================
    top:100x                    顶部距离
    right:100px                 右边距离
    opacity:0.5;                //透明度 
}
```

### 定位 relative 相对定位
保留原来位置进行定位（灵魂出窍)

相对于原来出生的位置进行定位

```
div {
    position:relative
    top:100px                   顶部距离
    left:100px                  左边距离
    ========================================
    top:100x                    顶部距离
    right:100px                 右边距离
}
```

### 定位 fixed 固定定位
```
div {
    position:fixed              相对于窗口
    top:100px                   顶部距离
    left:100px                  左边距离
    ========================================
    top:100x                    顶部距离
    right:100px                 右边距离
}
```

居中固定做法
```
div {
    position:absolute|fixed 相对于文档 
    left:50%;
    top:50%;
    width:100px;
    height:100px;
    background-color:red;
    margin-left:50%;
    marign-top:50%;
}
```

圆形
```
 div{
     width:100px;
     height:100px;
     border:10px solid black;
     border-radius:50%
 }
```

两栏布局
```
    //要先right 把position 位置让出来。
    <div class="right"></div>
    <div class="left"></div>
    .right {
        position:absolute
        right:0;
        width:100px;
        height:100px;
        background-color:#fcc;
        opacity:0.5;
    }
    
    .left{
        margin-right:100px;
        height:100px;
        background-color:#123;
    }
```

 

==使用定律==
==用relative 进行参照物,absolute 进行定位==

# BFC
```
垂直的 margin 父子会结合在一起去最大的值。

<div class="wrapper">
    <div class="content"></div>
</div>

.wrapper{
    margin-left:100px;
    margin-top:100px;
    width:100px;
    height:100px;
    background-color:black;
    border-top:1px solid red;
}

.content{
    margin-left:50px;
    margin-top:150px;
    width:50px;
    height:50px;
    background-color:green;
}



```

解决margin 塌陷的方法

```
bfc
block format context
如何触发一个盒子的bfc


以下是弥补的方案

//position:absolute;      //腾出原来的位置浮动
//display:inline-block;   //去掉独占一行
//float:left/right;
//overflow:hidden;        //溢出部分隐藏

<div class="wrapper">
    <div class="content"></div>
</div>

.wrapper{
    margin-left:100px;
    margin-top:100px;
    width:100px;
    height:100px;
    background-color:black;
    border-top:1px solid red;
    overflow:hidden;    //溢出部分隐藏
}

.content{
    margin-left:50px;
    margin-top:150px;
    width:50px;
    height:50px;
    background-color:green;
}
```
margin 合并问题不解决，用数学的方式解决，
```
    <div class="demo1">1</div>
    <div class="demo2">2</div>
    
    .demo1{
        background-color:red;
        margin-bottom:200px + 100px(demo2 的 margin-top) 300px ;
    }
    
    .demo2{
        background-color:green;
    }
    
```

#### float 问题

凡是设置了 position:abolute;float:left/right 内核内部会把元素转成inline-block

```
1.它能使元素站队
<div class='wrapper'>
    <div class="content">1</div>
    <div class="content">2</div>
    <div class="content">3</div>
</div>

2.浮动元素产生了浮动流
    1. 所有产生了浮动流元素，块级元素看不到他们
    2. 产生了BFC的元素，和文本类属性的元素(inline)以及文本都能看到浮动元素
    
3.浮动流包裹不住
    - p标签css用 clear:both(清楚两边浮动流解决)
<div class="wrapper">
    <div class="content1"></div>
    <div class="content2"></div>
    <div class="content3"></div>
    <p></p>
</div>

.wapper{
    border:1px  solid black;
}

.content{
    float:left;
    color:#fff;
    background-color:black;
    width:100px;
    height:100px;
}

p{
    border-top:0 solid green;
    clear:both;
}


```

#### 伪元素

伪元素天生是行级元素。

```
<span> 你好 </span>

span::before{
    content:"Panda";
}

span::after{
    cotent:""
}

//利用伪元素清楚浮动流，达到浮动包裹的目的
<div class="wrapper">
    <div class="content"></div>
    <div class="content"></div>
    <div class="content"></div>
</div>

.content{
    float:left;
    width:100px;
    height:100px;
    background-color:black;
    color:#fff;
}

.wrapper::after{
    content:""
    clear:both;
    display:block;
}
```

导航

```
<ul class="nav">
    <li class="list-item">天猫</li>
    <li class="list-item">聚划算</li>
    <li class="list-item">天猫超市</li>
</ul>


.nav {
    list-style:none;
}

.nav::after{
    cotent:"";
    display:block;
    clear:both;
}

.nav .list-item{
    float:left;
    margin:0px 10px;
    height:30px;
    line-height:30px;
}

.nav .list-item a {
    padding:0,5px;
    color:#f40;
    height:30px;
    font-weight:bold;
    display:inline-block;
    border-radius:15px;
}

.nav .list-item a:hover{
    background-color:#f40;
    color:#FFF;
}

```

### 双飞翼布局

### 弹性和模型

样式参考

flex 布局

https://www.runoob.com/w3cnote/flex-grammar.html

http://www.phpstudy.net/css3/
https://www.html.cn/doc/css3/flex/index.htm

核心样式  旧的
```
display:-webkit-box:
-webkit-box-orient:horizontal;
-webkit-box-pack:center;
-webkit-box-align:center;
```

核心样式 新的
```
display:-webkit-flex|-webkit-inline-flex
-webkit-flex-direction: row | row-reverse | column | column-reverse
```

```
.col {
 -webkit-column-count:2;        //分裂
 -webkit-column-style:dotted;   //间隔样式
}

//居中
.center {
    display:-webkit-box;
    -webkit-box-pack:center;        //垂直居中
    
    -webkit-box-align:center;   //水平居中
    
    height:300px;
    width:300px;
}

```

# FlexBox 
```
<html>
    <head>
        <meta charse="utf-8">
        <title>flex box</title>
        <style type="text/css">
            .first {
                height:100px;
                background-color:"aquamarine";
            }
            .second {
                height:100px;
                background:orign
            }
            .three {
                height:100px;
                background:red;
            }
        </style>
    </head>
    <body>
        
    </body>
</html>
```

### css3 新增选择器

属性选择器
```
[att*=val] 全选
[att^=val] 选择首字母 = val
[att$=val] 选择首字母 = val

是的属性选择器有了通配符的概念

<style>
    [id*=div] {
        color:red;
    }
</style>

<body>
    <div id="div1">实例文本1</div>
    <div id="div2">实例文本2</div>
    <div id="div3">实例文本3</div>
    <div id="div4">实例文本4</div>
    <div id="div5">实例文本5</div>
    <div id="div6">实例文本6</div>
</body>

```