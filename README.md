# webSocketUtil

[![NPM version](https://img.shields.io/npm/v/@dabing_bigpawn/socket-util.svg?style=flat)](https://npmjs.org/package/@dabing_bigpawn/socket-util)
[![NPM downloads](http://img.shields.io/npm/dm/@dabing_bigpawn/socket-util.svg?style=flat)](https://npmjs.org/package/@dabing_bigpawn/socket-util)

## Install

```bash
$ pnpm install
```

```bash
$ npm run dev
$ npm run build
```

## Options

url：要连接的 WebSocket URL；
protocols：一个协议字符串或者一个包含协议字符串的数组；
query：可以通过 URL 传递给后端的查询参数；
greet：心跳检测的打招呼信息；
customBase：自定义的 baseURL。


onopen：触发 dep 内 open 对应的回调函数并且打开心跳检测；
onclose：触发 dep 内 close 对应的回调函数并且对关闭的 code 码进行判断，如果是非正常关闭连接，将会进行重连，如果重连次数达到阈值，则通知给用户；
onerror：触发 dep 内 error 对应的回调函数；
onmessage：接收到服务端返回的数据，可以先根据自身业务做一些预处理，比如我就根据不同的数据类型进行了数据解析的预处理，之后再触发 dep 内 message 对应的回调函数并传入处理过后的数据。


subscribe：订阅 WebSocket 事件，传入事件类型并须是 EventTypes 内的类型之一，第二个参数则是回调函数；
sendMessage：同样的，我们在给服务端发送数据之前也可以根据自身业务做一些预处理，比如我将需要转成 JSON 的数据，在这里统一转换后再发送给服务端；
closeSocket：关闭 WebSocket 连接；
resetHeartCheck：重置心跳检测定时器。

## LICENSE

MIT
# webSocketUtil
WebSocket 封装
