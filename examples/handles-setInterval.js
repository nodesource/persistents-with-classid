'use strict';

const persistents = require('../persistents-with-classid');
const async_wrap = process.binding('async_wrap');
const assert = require('assert');

var iv1, iv2, iv3

function onTimeout() {
  // here the function declaration is named, easy enough
  clearInterval(iv1);
}

global.onOtherTimeout = function () {
  // global functions are bad, even for timeouts ;)
  // let's fix that ;)
  delete global.onOtherTimeout;
  clearInterval(iv2);
}

function Me() {}
Me.prototype.timeout = function () {
  // assigning to prototype property results in
  // the function name being derived from the
  // prototype name and the property name
  clearInterval(iv3);
}

iv1 = setInterval(onTimeout, 20);
iv2 = setInterval(global.onOtherTimeout, 10);
iv3 = setInterval(new Me().timeout, 30);

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

const result = persistents.collect();
const keys = Object.keys(result);

assert.equal(keys.length, 1);
assert.equal(keys[0], async_wrap.Providers['TIMERWRAP'])

inspect(result, 2);
