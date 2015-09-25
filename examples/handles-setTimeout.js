'use strict';

const persistents = require('../persistents-with-classid');
const async_wrap = process.binding('async_wrap');
const assert = require('assert');

function onTimeout() {
  // here the function declaration is named, easy enough
}

global.onOtherTimeout = function () {
  // global functions are bad, even for timeouts ;)
  // let's fix that ;)
  delete global.onOtherTimeout;
}

function Me() {}
Me.prototype.timeout = function () {
  // assigning to prototype property results in
  // the function name being derived from the
  // prototype name and the property name
}

var assignedTimeout = function () {
  // here the name the function was assigned to
  // is returned as the function name
}

setTimeout(onTimeout, 10);
setTimeout(global.onOtherTimeout, 10);
setTimeout(new Me().timeout, 20);
setTimeout(assignedTimeout, 5);
setTimeout(function () {
  // inline anonymous function
}, 10);

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

const result = persistents.collect();
const keys = Object.keys(result);

assert.equal(keys.length, 1);
assert.equal(keys[0], async_wrap.Providers['TIMERWRAP'])

inspect(result, 2);
