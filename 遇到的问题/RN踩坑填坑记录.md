## 服务无法启动
### 1.报错501：Ambiguous resolution
应该是有多个node_modules文件夹：运行`npm start -- --reset-cache`，删除缓存。如果还不行，就看看新增了哪个依赖，删除这个依赖再试试，如果还不行，删除整个项目，重新安装。
## link失效
### 1.无论link了多少次，重装后依然不生效：
有可能是`android\app\src\main\java\com\echoesnet\futures\MainWithUpdateActivity.java`的问题，修改代码
```
// add 引入包
import com.lwansbrough.RCTCamera.RCTCameraPackage;
......
 private void doVocationalWork(String localBundle) {
    if (TextUtils.isEmpty(localBundle)) {
    Log.i("dev-liu|", "use dev-env, maybe work at 'Running Metro Bundler on port 8081.'");
     mReactInstanceManager = ReactInstanceManager.builder()
// add this line
   .addPackage(new RCTCameraPackage())
  ...
}else{
// add
.addPackage(new RCTCameraPackage())
}
```