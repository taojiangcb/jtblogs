---
title: IFC BFC FFC GFC
catalog: true
date: 2019-12-29 23:05:47
subtitle:
header-img:
tags:
---
# BFC
BFC（Block Formatting Context）格式化上下文，是Web页面中盒模型布局的CSS渲染模式，指一个独立的渲染区域或者说是一个隔离的独立容器。 

### BFC 应用
- 防止margin重叠
- 清除内部浮动
- 自适应两（多）栏布局
- 防止字体环绕

### 触发BFC条件
- 根元素
- float的值不为none
- overflow的值不为visible
- display的值为inline-block、table-cell、table-caption
- position的值为absolute、fixed

### ⾃适应两栏布局
根据BFC布局规则：
1.  每个元素的margin box的左边，与包含块border box的左边相接触(对于从左向右的格式化，否则相反).即使存在浮动也是如此。
2. BFC的区域不会与float box重叠
```
<style>
body {
width: 300px;
position: relative;
}
.aside {
width: 100px;
height: 150px;
float: left;
background: #f66;;
}
.main {
height: 200px;
background: #fcc;
}
</style>
</head>
<body>
<div class="aside"></div>
<div class="main"></div>
</body>
```

### 清除内部浮动
计算BFC的⾼度时，浮动元素也参与计算

### 防⽌垂直margin重叠
Box垂直⽅向的距离有margin决定。属于同⼀个BFC的两个相邻的Box的margin会发⽣重叠

# IFC
IFC(Inline Formatting Context)内联格式化上下⽂。IFC的line box(线框)⾼度有其包
含的⾏内元素中的最⾼的实际⾼度计算⽽来(不受到垂直⽅向的padding/margin影响)

# FFC
FFC(Flex Formatting Context)⾃适应格式化下上⽂。display为flex或者inline-flex的
元素将会⽣成⾃适应容器

# GFC
GFC(GridLayout Formatting Context)⽹格格式化上下⽂。当为⼀个元素设置display
为grid的时候，此元素将会获得⼀个独⽴的渲染区域，我们可以通过在⽹格容器(grid
container)上定义⽹格定义⾏(grid definition rows)和⽹格定义列(grid definition
columns)属性各在⽹格项⽬(grid item)上定义⽹格⾏(grid row)和⽹格列(grid columns)
为每⼀个⽹格项⽬(grid item)定义位置和空间.