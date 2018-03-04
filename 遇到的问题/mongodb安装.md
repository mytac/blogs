## 下载
官网下步骤贼多，从网上搜到[Windows系统各个64位版本下载地址](http://dl.mongodb.org/dl/win32/x86_64)
下.msi文件

## 安装及配置
按照[ 详细图解mongodb 3.4.1 win7x64下载、安装、配置与使用2017/01/16](http://blog.csdn.net/qq_27093465/article/details/54574948)文章的步骤配置并安装。

但是最后运行``` net start MongoDB```还是报**服务名无效错误解决**

参照[net start MongoDB 服务名无效错误解决](http://blog.csdn.net/grs294845170/article/details/77848114)这篇文章配置后能成功启动服务。

## 安装可视化工具
下载[robomongo](https://robomongo.org/download)

安装好之后，左上角有一个connect，新建一个localhost，如图
![demo](https://wx2.sinaimg.cn/mw690/6f8e0013ly1fm97venzedj20g40krmxq.jpg)