# fc-helper

函数计算 & API 网关辅助库

## 原始形式

```js
exports.handle = function(event, context, callback) {
  // 处理 event
  callback(null, {
    isBase64Encoded: false,
    statusCode: statusCode,
    headers: headers,
    body: body
  });
}
```

## 新形式

```js
'use strict';

const hook = require('fc-helper');

exports.handle = hook((req, res) => {
  res.send('Hello world!\n');
});
```

会更接近于常见 Web 开发的体验。

## API

### hook

将一个 Web 形式的处理单元转化为原始形式。使用方法：

```js
const hook = require('fc-helper');

exports.handle = hook((req, res) => {
  res.send('Hello world!\n');
});
```

### Request

包装后的 Request 对象：具有 path、method、headers、query、params、body只读属性。

### Response

包装后的 Response 对象：

可以通过 res.type = "" 的方式设置 content-type。
可以通过 res.status = 200 的方式设置 statusCode。
可以通过 res.setHeader('key', 'value') 的方式设置任意 header。
可以通过 res.send(body) 的方式设置 body。如果没有设置 content-type，会根据 body 类型自动设置 content-type

- string，会自动填充类型为 text/plain
- object，会自动填充类型为 application/json

## License
The MIT license
