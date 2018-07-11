## 前言
之前我写过一篇有关于git提交的文档[《用gitmoji来提交你的git commit吧》](https://www.jianshu.com/p/3191a33d5a96)，然而在实际上应用并不是很方便，大多情况得翻阅gitmoji对照表来写commit，且并不规范，仅仅适用于自己开发的项目，放到团队上commit可读性不高。最近翻阅了一篇文章[《你可能会忽略的 Git 提交规范》](http://jartto.wang/2018/07/08/git-commit/)，才知道自己之前写的commit非常随意，在项目初期，写的还蛮正规的：

![demo](http://chuantu.biz/t6/341/1531277987x-1376440234.png)

然而之后懒了，前面的tag也没加。（所以说，好的习惯要坚持，只要有一次没做，后面就容易堕怠）

![demo](http://chuantu.biz/t6/341/1531278047x-1376440234.png)

去审查一下你自己的commit~如果你不习惯使用git GUI，在bash中运行以下命令：
```
$ git log [tag name/branch name] HEAD --pretty=format:%s
```
## commit规则格式
建议的格式如下：
```
<type>(<scope>): <subject>
```
### type
用于声明此次commit的主要目的类别：
```
feat：feature、发布新功能
fix：修复bug
docs：更新文档
style： 代码格式
refactor：代码重构
test：增加测试
chore：构建过程或辅助工具的变动
```
### scope
用于说明commit影响的范围；如数据层(model)，视图层(view)，控制层（controller）等。
### subject
commit的主题描述，少于50个字。

>其实在[《Commit message 和 Change log 编写指南》](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)这篇文章中都有很详细的描述，文中也提到了commit message有body和footer，用于详细描述和关闭issue的补充。不过个人觉得在subject中写这些内容已经足够了。
## 了解git hooks
提到`“hooks”`这个词我们应该并不陌生，比如`vue`和`react`都有自己的`lifecycle hooks`，在git中分为`客户端hooks`和`服务端hooks`。在commit阶段中涉及到的是客户端hooks，其中客户端hooks包含：

>pre-commit 钩子在键入提交信息前运行。 它用于检查即将提交的快照，例如，检查是否有所遗漏，确保测试运行，以及核查代码。 如果该钩子以非零值退出，Git 将放弃此次提交，不过你可以用 git commit --no-verify 来绕过这个环节。 你可以利用该钩子，来检查代码风格是否一致（运行类似 lint 的程序）、尾随空白字符是否存在（自带的钩子就是这么做的），或新方法的文档是否适当。

>prepare-commit-msg 钩子在启动提交信息编辑器之前，默认信息被创建之后运行。 它允许你编辑提交者所看到的默认信息。 该钩子接收一些选项：存有当前提交信息的文件的路径、提交类型和修补提交的提交的 SHA-1 校验。 它对一般的提交来说并没有什么用；然而对那些会自动产生默认信息的提交，如提交信息模板、合并提交、压缩提交和修订提交等非常实用。 你可以结合提交模板来使用它，动态地插入信息。

>commit-msg 钩子接收一个参数，此参数即上文提到的，存有当前提交信息的临时文件的路径。 如果该钩子脚本以非零值退出，Git 将放弃提交，因此，可以用来在提交通过前验证项目状态或提交信息。 

>post-commit 钩子在整个提交过程完成后运行。 它不接收任何参数，但你可以很容易地通过运行 git log -1 HEAD 来获得最后一次的提交信息。 该钩子一般用于通知之类的事情。

这里我们主要是在`pre-commit`阶段来检查commit是否符合规范。
## 提交前的配置
### 自动格式化代码
在提交代码前需要格式代码，这里用git hooks：`pre-commit`。
#### lint-staged
针对暂存的git文件运行linters并且不要让垃圾代码滑入你的代码库！lint-staged的最新版本需要Node.js v6或更新版本。（在v7之前的lint-staged版本仍可与Node.js v4一起使用。）
#### husky
在git hooks每个阶段执行脚本来避免垃圾代码的提交和push。
安装`lint-staged`和`husky`
```
yarn add lint-staged husky
```
在`package.json`写入：
```
  "scripts": {
    ...
    "precommit":"lint-staged"
  },
  "lint-staged": {
    "*.js": ["eslint --fix","git add"]
  },
```
这时当你执行`git commit`操作时，一旦在暂存区存在eslint格式错误的代码，将会自动修复并加入缓存区（eslint --fix 无法自动修复的将会报错）。

如图：

![无法自动修复，commit失败](http://chuantu.biz/t6/341/1531297142x-1404814694.png)
### 规范化commit-msg
这里我们使用另一个git hooks：`commitmsg`，我们来安装`validate-commit-msg`检查 Commit message 是否符合格式。
```
yarn add validate-commit-msg
```
在`package.json`中配置：
```
"scripts": {
    ...
    "commitmsg": "validate-commit-msg"
  },
```
如果要进行自定义配置，我们可以自建一个文件`.vcmrc`:
```
{
  "types": ["feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "chore", "revert",":art"],
  "scope": {
    "required": false,
    "allowed": ["*"],
    "validate": false,
    "multiple": false
  },
  "warnOnFail": false,
  "maxSubjectLength": 100,
  "helpMessage": "",
  "autoFix": false
}
```
随便写一个commit，会提示不符合规范。

![demo](http://chuantu.biz/t6/341/1531299679x-1404814694.png)

让我们来写一个示例~
```
git commit -m "style: eslint"
```
测试一下，成功提交~~关于commit-msg这部分可以参考[vue的commit](https://github.com/vuejs/vue/commits/dev).

![demo](http://chuantu.biz/t6/341/1531300144x-1404814694.png)

## 参考文档
1. [你可能会忽略的 Git 提交规范](http://jartto.wang/2018/07/08/git-commit/)
2. [Commit message 和 Change log 编写指南](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)
3. [使用 ESlint、lint-staged 半自动提升项目代码质量](https://www.jianshu.com/p/cdd749c624d9)
4. [8.3 自定义 Git - Git 钩子](https://git-scm.com/book/zh/v2/%E8%87%AA%E5%AE%9A%E4%B9%89-Git-Git-%E9%92%A9%E5%AD%90)