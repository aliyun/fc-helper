'use strict';

const Context = require('./context');

function hook (handler) {
  return function(event, context, callback) {
    if (handler.constructor.name !== 'AsyncFunction') {
      var err = new TypeError('Must be an AsyncFunction');
      return callback(err);
    }

    const ctx = new Context(event, context);

    handler(ctx).then(() => {
      const data = ctx.body;
      var encoded = false;
      if (typeof data === 'string') {
        if (!ctx.type) {
          ctx.type = 'text/plain';
        }
        ctx.body = data;
      } else if (Buffer.isBuffer(data)) {
        encoded = true;
        if (!ctx.type) {
          ctx.type = 'application/octet-stream';
        }
        ctx.body = data.toString('base64');
      } else if (typeof data === 'object') {
        if (!ctx.type) {
          ctx.type = 'application/json';
        }
        ctx.body = JSON.stringify(data);
      }

      return {
        isBase64Encoded: encoded,
        statusCode: ctx.status,
        headers: ctx.res.headers,
        body: ctx.body
      };
    }).then((response) => {
      callback(null, response);
    }, (err) => {
      callback(err);
    });
  };
}

class Tester {
  constructor(handler) {
    this.handler = handler;
  }

  run(event, context) {
    if (!context) {
      context = {};
    }
    return new Promise((resolve, reject) => {
      this.handler(event, context, function (err, result) {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }
}

function test(handler) {
  return new Tester(handler);
}

function asyncWrap(asyncCall) {
  return function (event, context, callback) {
    if (asyncCall.constructor.name !== 'AsyncFunction') {
      var err = new TypeError('Must be an AsyncFunction');
      return callback(err);
    }

    asyncCall(event, context).then((result) => {
      callback(null, result);
    }, (err) => {
      callback(err);
    });
  };
}

module.exports = {
  asyncWrap,
  hook,
  test
};
