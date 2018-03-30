'use strict';

const ORIGIN_EVENT = Symbol.for('ctx#origin_event');
const EVENT = Symbol.for('ctx#event');
const EVENT_PARSED = Symbol.for('ctx#event_parsed');
const PARSED_EVENT = Symbol.for('ctx#parsed_body');
const BODY_PARSED = Symbol.for('ctx#body_parsed');
const BODY = Symbol.for('ctx#body');

class Request {
  constructor(event, context) {
    this[ORIGIN_EVENT] = event;
    this[PARSED_EVENT] = null;
  }

  get [EVENT]() {
    if (!this[EVENT_PARSED]) {
      this[EVENT_PARSED] = JSON.parse(this[ORIGIN_EVENT]);
      this[ORIGIN_EVENT] = null;
    }

    return this[EVENT_PARSED];
  }

  get path() {
    return this[EVENT].path;
  }

  get method() {
    return this[EVENT].httpMethod;
  }

  get headers() {
    return this[EVENT].headers;
  }

  get query() {
    return this[EVENT].queryParameters;
  }

  get params() {
    return this[EVENT].pathParameters;
  }

  get body() {
    if (!this[BODY_PARSED]) {
      if (this[EVENT].isBase64Encoded) {
        this[BODY] = Buffer.from(this[EVENT].body, 'base64').toString();
      } else {
        this[BODY] = this[EVENT].body;
      }
      this[BODY_PARSED] = true;
    }

    return this[BODY];
  }
}

class Response {
  constructor() {
    this.statusCode = 200;
    this.headers = {};
    this.typeSetted = false;
    this.body = null;
  }
}

class Context {
  constructor(event, context) {
    this.req = new Request(event, context);
    this.res = new Response();
  }

  // req delegate

  get headers() {
    return this.req.headers;
  }

  get method() {
    return this.req.method;
  }

  get url() {
    // return this.req.
  }

  get path() {
    return this.req.path;
  }

  get query() {
    return this.req.query;
  }

  get params() {
    return this.req.params;
  }

  set type(value) {
    this.res.typeSetted = true;
    this.res.headers['content-type'] = value;
  }

  get type() {
    return this.res.headers['content-type'];
  }

  set body(value) {
    this.res.body = value;
  }

  get body() {
    return this.res.body;
  }

  set status(code) {
    this.res.statusCode = code;
  }

  get status() {
    return this.res.statusCode;
  }

  set(key, value) {
    this.res.headers[key] = value;
  }

  get(key) {
    return this.headers[key];
  }
}

module.exports = Context;
