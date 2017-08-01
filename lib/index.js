'use strict';

const Request = require('./request');
const Respnose = require('./response');

module.exports = function (handler) {
  return function(event, context, callback) {
    var request = new Request(event, context);
    var response = new Respnose(callback);
    handler(request, response);
  };
};
