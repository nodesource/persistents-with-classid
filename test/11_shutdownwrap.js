'use strict';

const test = require('tape').test
const net = require('net')
const async_wrap = process.binding('async_wrap');
const persistents = require('../')
const provider = require('./util/get-provider')('SHUTDOWNWRAP')
const PORT = 3000

// Not only is SHUTDOWNWRAP used when the process exits, but
// TCP connections will also use a SHUTDOWNWRAP when the connection is closed.
test('\nshutdownwrap: net.createServer and net.connect -> waiting for connection to close', function (t) {
  function init(id) {
    if (id === provider) {
      const res = persistents.collect()[provider]
      setImmediate(check.bind(null, res))
    }
  }

  function noop() {}
  // only way to catch writewrap is by hooking into async_wrap
  async_wrap.setupHooks(init, noop, noop);
  async_wrap.enable();

  net.createServer(function(c) {
    c.end();
    this.close();
  }).listen(PORT, function() {
    net.connect(PORT, onconnected);
  });

  function onconnected() { }

  function check(res) {
    // this gets called multiple times (each time data is written to a stream?)
    t.equal(res.length, 1, 'one shutdownwrap')
    t.equal(Object.getPrototypeOf(res[0]).constructor.name, 'ShutdownWrap', 'ShutdownWrap prototype')
    t.end()
  }
})
