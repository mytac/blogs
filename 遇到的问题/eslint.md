## flow
安装 `eslint-plugin-flowtype`

```
npm install eslint --save-dev
npm install babel-eslint --save-dev
npm install eslint-plugin-flowtype --save-dev
```
配置`.eslintrc`
```
{
  "parser": "babel-eslint",
  "plugins": [
    "flowtype"
  ],
  "rules": {
      ....
  }
```
### 报错处理
#### 1. "Cannot read property 'type' of undefined" 
用以下版本解决：
```
"babel-core": "6.26.0", // 目前babel7还再测试，用6更稳定
"eslint": "4.13.0", // 官方也指定这个版本不会报这个错
"eslint-plugin-flowtype": "^2.49.3", // 这个可以是最新版
```