# ipv6的问题
[开启ipv6](https://github.com/XX-net/XX-Net/issues/6918#issuecomment-335667804)
```
netsh interface isatap set state default
netsh interface teredo set state default
netsh interface teredo set state server=teredo.remlab.net
netsh interface ipv6 set teredo enterpriseclient
cmd
netsh int ipv6 add route ::/0 "Teredo Tunneling Pseudo-Interface"
```

[开teredo隧道报错 显示未能打开隧道适配器](https://github.com/XX-net/XX-Net/issues/8739)