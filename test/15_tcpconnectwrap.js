'use strict';

const test = require('tape').test
const net = require('net')
const persistents = require('../')
const provider = require('./util/get-provider')('TCPCONNECTWRAP')
const PORT = 3000

test('\ntcpconnectwrap: net.createServer and net.connect', function (t) {
  net.createServer(function(c) {
    c.end();
    this.close();
  }).listen(PORT, function() {
    net.connect(PORT, onconnected);
  });

  function onconnected() {
    const res = persistents.collect()[provider]
    t.equal(res.length, 1, 'one tcpconnectwrap')
    t.equal(res[0].port, PORT, 'the server we created')
    t.end()
  }
})
