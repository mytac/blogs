1. `constructor`中获取不到props（taro v1.2.0-beta.2）
2. `getLocation()`，ios 12.1.2在调取地理位置时，如果获取不到地理信息，下一次再调起的时候，会一直挂起，没有异常抛出，导致之后的处理一直阻塞。我的解决方法是用`Promise.race([])`，如果挂起，超时后则返回预置信息。（taro v1.2.0-beta.2）