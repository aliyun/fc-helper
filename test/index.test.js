'use strict';

const assert = require('assert');
const { hook, asyncWrap, test } = require('../');

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
    const res = await test(handle).run('');
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'text/plain');
    assert.equal(res.body, 'hello world!');
  });

  it('should ok with json', async () => {
    var handle = hook(async function (ctx) {
      ctx.body = {ok: true};
    });
    const res = await test(handle).run('');
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'application/json');
    assert.equal(res.body, '{"ok":true}');
  });

  it('should ok with raw json', async () => {
    var handle = hook(async function (ctx) {
      ctx.type = 'application/json';
      ctx.body = '{"ok":true}';
    });
    const res = await test(handle).run('');
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'application/json');
    assert.equal(res.body, '{"ok":true}');
  });

  it('should ok with raw json/object', async () => {
    var handle = hook(async function (ctx) {
      ctx.type = 'application/json';
      ctx.body = {'ok':true};
    });
    const res = await test(handle).run('');
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'application/json');
    assert.equal(res.body, '{"ok":true}');
  });

  it('should ok with Buffer', async () => {
    var handle = hook(async function (ctx) {
      ctx.body = Buffer.from('hello world!');
    });
    const res = await test(handle).run('');
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'application/octet-stream');
    assert.equal(res.body, Buffer.from('hello world!').toString('base64'));
  });

  it('should ok with context', async () => {
    var handle = hook(async function (ctx) {
      ctx.body = ctx.requestId;
    });
    const res = await test(handle).run('', {requestId: 'requestId'});
    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'requestId');
  });

  it('should ok with error', async () => {
    var handle = hook(async function (ctx) {
      throw new Error('oops');
    });
    var err;
    try {
      await test(handle).run('');
    } catch (ex) {
      err = ex;
    }
    assert.ok(err);
    assert.equal(err.message, 'oops');
  });

  it('should ok with non-async function', async () => {
    var handle = hook(function () {});
    var err;
    try {
      await test(handle).run('');
    } catch (ex) {
      err = ex;
    }
    assert.ok(err);
    assert.equal(err.message, 'Must be an AsyncFunction');
  });

  it('should ok with asyncWrap', async () => {
    var handle = asyncWrap(async function (ctx) {
      return 'hello world!';
    });
    const res = await test(handle).run('');
    assert.equal(res, 'hello world!');
  });

  it('should ok with asyncWrap when error', async () => {
    var handle = asyncWrap(async function (ctx) {
      throw new Error('ooops!');
    });
    var err;
    try {
      await test(handle).run('');
    } catch (ex) {
      err = ex;
    }

    assert.ok(err);
    assert.equal(err.message, 'ooops!');
  });

  it('should ok with asyncWrap when not async functions', async () => {
    var handle = asyncWrap(function() {});
    var err;
    try {
      await test(handle).run('');
    } catch (ex) {
      err = ex;
    }

    assert.ok(err);
    assert.equal(err.message, 'Must be an AsyncFunction');
  });

  it('GET should ok', async () => {
    var handle = hook(async function(ctx) {
      ctx.body = {
        path: ctx.path,
        method: ctx.method,
        query: ctx.query,
        headers: ctx.headers,
        params: ctx.params,
        body: ctx.req.body
      };
    });
    var q = {};
    q.echostr = 'hehe';
    var event = {
      'path': '/wechat',
      'httpMethod': 'GET',
      'headers': {},
      'queryParameters': q,
      'pathParameters': {},
      'body': '',
      'isBase64Encoded': false
    };
    const data = await test(handle).run(JSON.stringify(event), {});
    const body = JSON.parse(data.body);
    assert.equal(body.path, '/wechat');
    assert.equal(body.method, 'GET');
    assert.equal(body.query.echostr, 'hehe');
  });

  it('GET should ok', async () => {
    var handle = hook(async function(ctx) {
      ctx.body = {
        path: ctx.path,
        method: ctx.method,
        query: ctx.query,
        headers: ctx.headers,
        params: ctx.params,
        body: ctx.req.body
      };
      ctx.req.body; // second access
      ctx.get('content-type');
      ctx.set('content-type', 'application/json');
      ctx.status = 200;
    });
    var q = {};
    q.echostr = 'hehe';
    var event = {
      'path': '/wechat',
      'httpMethod': 'GET',
      'headers': {'content-type': 'text/plain'},
      'queryParameters': q,
      'pathParameters': {},
      'body': Buffer.from('hello world').toString('base64'),
      'isBase64Encoded': true
    };
    const data = await test(handle).run(JSON.stringify(event), {});
    const body = JSON.parse(data.body);
    assert.equal(body.path, '/wechat');
    assert.equal(body.method, 'GET');
    assert.equal(body.query.echostr, 'hehe');
  });
});
