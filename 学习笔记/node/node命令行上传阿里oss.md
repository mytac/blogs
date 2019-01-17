## package.json配置
```json
{
  "name": "xxx",
  "version": "0.17.0",
  "private": true,
  "homepage": "./",
  "scripts": {
    "deploy": "node deploy.js"
  },
```
## 编写脚本
### 安装
```
yarn add ali-oss
```
### 配置oss
```js
const client = new OSS({
    region: 'oss-cn-hangzhou',
    // 云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
    accessKeyId: 'xxxxxxxxxxxx',
    accessKeySecret: 'yyyyyyyyy',
    bucket: 'your-bucket',
});
```
```js
async function put() {
    try {
        const jsStream = fs.createReadStream('./dist/index.js');
        await client.putStream(`${SERVER_CONFIG[server] || SERVER_CONFIG.default}/index.js`, jsStream);
        if (uploadType && uploadTypeConfig[uploadType]) {
            const fileName = uploadTypeConfig[uploadType];
            await client.putStream(`${SERVER_CONFIG[server] || SERVER_CONFIG.default}/${fileName}`, fs.createReadStream(`./dist/${fileName}`));
        }
        console.log('\033[42;30m SUCCESS \033[40;32m ～(￣▽￣～)(～￣▽￣)～上传完成~~ \033[0m');
    } catch (err) {
        console.log('\033[41;30m FAIL \033[40;31m 上传失败 \033[0m');
        console.log(err);
    }
}

put();
```
输入命令
```
yarn deploy beta
```

![demo](https://s2.ax1x.com/2019/01/17/kprkkQ.png)

## 参考链接
1. [ali-oss-文档](https://www.alibabacloud.com/help/zh/doc-detail/32068.htm?spm=a2c63.p38356.a3.9.6e5d64cdV51ZGT#concept-32068-zh)