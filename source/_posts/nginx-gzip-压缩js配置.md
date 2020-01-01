---
title: nginx gzip 压缩js配置
catalog: true
tags:
  - nginx
date: 2020-01-01 23:46:26
subtitle:
header-img:
---

Nginx自带的有gzip模块 http://wiki.nginx.org/NginxChsHttpGzipModule ，这个模块支持在线实时压缩输出数据流。经过良好的配置优化，可以大幅的提升网站的输出效率。

### __使用范例__

```

gzip  on;
gzip_buffers 16 8k;
gzip_comp_level 6;
gzip_http_version 1.1;
gzip_min_length 256;
gzip_proxied any;
gzip_vary on;
gzip_types
    text/xml application/xml application/atom+xml application/rss+xml application/xhtml+xml image/svg+xml
    text/javascript application/javascript application/x-javascript
    text/x-json application/json application/x-web-app-manifest+json
    text/css text/plain text/x-component
    font/opentype application/x-font-ttf application/vnd.ms-fontobject
    image/x-icon;
gzip_disable  "msie6";
```

内置变量 $gzip_ratio 可以获取到gzip的压缩比率

指令:
```
[#gzip gzip]
[#gzip_buffers gzip_buffers]
[#gzip_comp_level gzip_comp_level]
[#gzip_min_length gzip_min_length]
[#gzip_http_version gzip_http_version]
[#gzip_proxied gzip_proxied]
[#gzip_types gzip_types]
```

### gzip 
```
语法: gzip on|off
默认值: gzip off
作用域: http, server, location, if (x) location
开启或者关闭gzip模块
```

### gzip_buffers
```
语法: gzip_buffers number size
默认值: gzip_buffers 4 4k/8k
作用域: http, server, location
设置系统获取几个单位的缓存用于存储gzip的压缩结果数据流。 例如 4 4k 代表以4k为单位，按照原始数据大小以4k为单位的4倍申请内存。 4 8k 代表以8k为单位，按照原始数据大小以8k为单位的4倍申请内存。

如果没有设置，默认值是申请跟原始数据相同大小的内存空间去存储gzip压缩结果。
```

### gzip_comp_level
```
语法: gzip_comp_level 1..9
默认值: gzip_comp_level 1
作用域: http, server, location
gzip压缩比，1 压缩比最小处理速度最快，9 压缩比最大但处理最慢（传输快但比较消耗cpu）。
```

### gzip_min_length
```
语法: gzip_min_length length
默认值: gzip_min_length 0
作用域: http, server, location
设置允许压缩的页面最小字节数，页面字节数从header头中的Content-Length中进行获取。
默认值是0，不管页面多大都压缩。
建议设置成大于1k的字节数，小于1k可能会越压越大。 即: gzip_min_length 1024
```

### gzip_http_version
```
语法: gzip_http_version 1.0|1.1
默认值: gzip_http_version 1.1
作用域: http, server, location
识别http的协议版本。由于早期的一些浏览器或者http客户端，可能不支持gzip自解压，用户就会看到乱码，所以做一些判断还是有必要的。 注：21世纪都来了，现在除了类似于百度的蜘蛛之类的东西不支持自解压，99.99%的浏览器基本上都支持gzip解压了，所以可以不用设这个值,保持系统默认即可。
```

###  gzip_proxied
```
语法: gzip_proxied [off|expired|no-cache|no-store|private|no_last_modified|no_etag|auth|any] …
默认值: gzip_proxied off
作用域: http, server, location
Nginx作为反向代理的时候启用，开启或者关闭后端服务器返回的结果，匹配的前提是后端服务器必须要返回包含”Via”的 header头。

off – 关闭所有的代理结果数据的压缩
expired – 启用压缩，如果header头中包含 “Expires” 头信息
no-cache – 启用压缩，如果header头中包含 “Cache-Control:no-cache” 头信息
no-store – 启用压缩，如果header头中包含 “Cache-Control:no-store” 头信息
private – 启用压缩，如果header头中包含 “Cache-Control:private” 头信息
no_last_modified – 启用压缩,如果header头中不包含 “Last-Modified” 头信息
no_etag – 启用压缩 ,如果header头中不包含 “ETag” 头信息
auth – 启用压缩 , 如果header头中包含 “Authorization” 头信息
any – 无条件启用压缩
```

### gzip_types

```
语法: gzip_types mime-type [mime-type ...]
默认值: gzip_types text/html
作用域: http, server, location
匹配MIME类型进行压缩，（无论是否指定）”text/html”类型总是会被压缩的。
注意：如果作为http server来使用，主配置文件中要包含文件类型配置文件

http
{
    include conf/mime.types;
    gzip on;
    gzip_min_length 1000;
    gzip_buffers 4 8k;
    gzip_http_version 1.1;
    gzip_types text/plain application/x-javascript text/css text/html application/xml;
    ……
}
```

默认情况下，Nginx的gzip压缩是关闭的
同时，Nginx默认只对text/html进行压缩
所以，开启gzip的指令如下：

```
gzip on;
gzip_http_version 1.0;
gzip_disable “MSIE [1-6].”;
gzip_types text/plain application/x-javascript text/css text/javascript;
```

关于gzip_types，如果你想让图片也开启gzip压缩，那么用以下这段吧：

```
gzip_types text/plain application/x-javascript text/css text/javascript application/x-httpd-php image/jpeg image/gif image/png;

```
 
### gzip_disable
 gzip_disable的设置是禁用IE6的gzip压缩，又是因为杯具的IE6
IE6的某些版本对gzip的压缩支持很不好，会造成页面的假死，今天产品的同学就测试出了这个问题，后来调试后，发现是对img进行gzip后造成IE6的假死，把对img的gzip压缩去掉后就正常了，为了确保其它的IE6版本不出问题，所以就加上了gzip_disable的设置
