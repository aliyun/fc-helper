'use strict';

const ORIGIN_EVENT = Symbol.for('#origin_event');
const EVENT = Symbol.for('#event');
const EVENT_PARSED = Symbol.for('#event_parsed');
const BODY_PARSED = Symbol.for('#body_parsed');
const BODY = Symbol.for('#body');

class Request {
  constructor(event, context) {
    this[ORIGIN_EVENT] = event;
    this[EVENT_PARSED] = null;
    this[BODY_PARSED] = false;
    this[BODY] = null;
    this.context = context;
    this.ctx = context;
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
        this[BODY] = new Buffer(this[EVENT].body, 'base64').toString();
      } else {
        this[BODY] = this[EVENT].body;
      }
      this[BODY_PARSED] = true;
    }

    return this[BODY];
  }
}

module.exports = Request;
