'use strict';

const Request = require('./request');
const Respnose = require('./response');

module.exports = function (handler) {
  return function(event, context, callback) {
    const request = new Request(event, context);
    const response = new Respnose(callback);
    handler(request, response);
  };
};
