'use strict';

class Response {
  constructor(callback) {
    this.headers = {};
    this.body = undefined;
    this.typeSetted = false;
    this.statusCode = 200;
    this.callback = callback;
  }

  set type(val) {
    this.setHeader('content-type', val);
    this.typeSetted = true;
  }

  set status(code) {
    this.statusCode = code;
  }

  setHeader(key, value) {
    this.headers[key] = value;
  }

  send(data) {
    if (typeof data === 'string') {
      if (!this.typeSetted) {
        this.type = 'text/plain';
      }
      this.body = data;
    } else if (typeof data === 'object') {
      if (!this.typeSetted) {
        this.type = 'application/json';
      }
      this.body = JSON.stringify(data);
    }
    this.end();
  }

  end() {
    var response = {
      isBase64Encoded: false,
      statusCode: this.statusCode,
      headers: this.headers,
      body: this.body
    };
    this.callback(null, response);
  }
}

module.exports = Response;
