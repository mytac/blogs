1. 模拟器白屏： 命令 `flutter run --enable-software-rendering`
2. unexpectly spend  long time: `flutter clean` 先把build文件清了
3. vscode debug
```
"configurations": [
        {
            "name": "Flutter",
            "request": "launch",
            "type": "dart",
            "program": "./lib/main.dart",
            "args": [
                "--enable-software-rendering"
            ]
        }
    ]
```