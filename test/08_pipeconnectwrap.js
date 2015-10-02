'use strict';

const test = require('tape').test
const fs = require('fs')
const net = require('net')
const persistents = require('../')
const provider = require('./util/get-provider')('PIPECONNECTWRAP')
const PIPE = __dirname + '/tmp/test.sock'
const PORT = 3000

test('\npipeconnectwrap: net.connect to file socket', function (t) {
  try {
    fs.unlinkSync(PIPE);
  } catch(e) { }

  function onconnect() { t.end() }

  net.createServer(function(c) {
    c.end();
    this.close();
  }).listen(PIPE, function() {
    net.connect(PIPE, onconnect);
    const res = persistents.collect()[provider]
    t.equal(res.length, 1, 'one pipeconnectwrap')
    t.equal(res[0].address, PIPE, 'the one connected to our file socket')
  });
})
