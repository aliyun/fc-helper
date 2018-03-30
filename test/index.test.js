'use strict';

const assert = require('assert');
const { hook, test } = require('../');

// exports.handle = function(event, context, callback) {
//   // 处理 event
//   callback(null, {
//     isBase64Encoded: false,
//     statusCode: statusCode,
//     headers: headers,
//     body: body
//   });
// }

describe('index.js', function () {
  it('should ok with plain text', async () => {
    var handle = hook(async function (ctx) {
      ctx.body = 'hello world!';
    });
    const res = await test(handle).run('', '');
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'text/plain');
    assert.equal(res.body, 'hello world!');
  });

  it('should ok with json', async () => {
    var handle = hook(async function (ctx) {
      ctx.body = {ok: true};
    });
    const res = await test(handle).run('', '');
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'application/json');
    assert.equal(res.body, '{"ok":true}');
  });

});
