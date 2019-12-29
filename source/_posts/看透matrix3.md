---
title: 看透matrix3
catalog: true
date: 2019-12-29 23:09:45
subtitle:
header-img:
tags:
---
先看我之前的一个例子:http://47.100.202.222/splitball/
可以看下工具调试，满屏的matrix3 跳动的热血沸腾的。
```
/*
*   a = 控制 X 的宽度
*　　b = 控制 Y 的倾斜
*　　c = 控制 X 的倾斜
*　　d = 控制 Y 的高度
*　　tx = 控制 X 坐标位置
*　　ty = 控制 Y 坐标位置

*  matrix = [a, b, c, d, tx, ty];
*
*  [a  b  u]                  [a*x + y*c + tx*1]
*  [c  d  v]   *  [x,y,1] =   [b*x + d*y + ty*1] 
*  [tx ty w]                  [0*x + 0*y + 1*1];
*
*  u = 0 v= 0 w = 1
*
*  x' = ax + yc + tx
*  y' = bx + dy + ty
*  
*  矩阵旋转
*  旋转实际上是缩放和倾斜组合的结果。缩放和倾斜一起可以扭曲坐标，以提供您理解为旋转的内容。
*  简单来说，没有应用任何其他类型的变换的任何旋转变换可以用以下矩阵表示
*  [cosine(30)   sine(30)      0]
*  [-sine(30)   cosine(30)     0]  
*  [0              0           0]
*  x' = cosine(30)*x - sine(30)*y + 0
*  y' = sine(30)*x + cosine(30)*y + 0
*  x' = .87*x - .5*y
*  y' = .5*x + .87*y
*/
```