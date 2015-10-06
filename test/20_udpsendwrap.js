'use strict';

const test = require('tape').test
var dgram = require('dgram')
const async_wrap = process.binding('async_wrap');
const persistents = require('../')
const provider = require('./util/get-provider')('UDPSENDWRAP')
const PORT = 3000

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

test('\nudpsendwrap: dgram.createSocket().bind(PORT) then .send(', function (t) {
  function init(id) {
    if (id === provider) {
      const res = persistents.collect()[provider]
      // we cannot under any circumstance throw inside async_wrap init
      // so let's check the result in the next event loop ;)
      setImmediate(check.bind(null, res))
    }
  }

  function check(res) {
    t.equal(res.length, 1, 'one udpsendwrap')
    t.equal(res[0].port, PORT, 'the one sending to our port')
    t.end()
  }

  function noop() {}
  // only way to catch udpsendwrap is by hooking into async_wrap
  async_wrap.setupHooks(init, noop, noop);
  async_wrap.enable();

  dgram.createSocket('udp4').bind(PORT, function onbound() {
    this.send(new Buffer(2), 0, 2, PORT, '::', this.close.bind(this));
  })
})
