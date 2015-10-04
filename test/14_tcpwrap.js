'use strict';

const test = require('tape').test
const net = require('net')
const persistents = require('../')
const provider = require('./util/get-provider')('TCPWRAP')
const PORT = 3000

test('\ntcpwrap: net.createServer', function (t) {
  const server = net.createServer().listen(PORT);

  const res = persistents.collect()[provider]
  t.equal(res.length, 1, 'one tcpwrap')
  t.equal(res[0].owner._connectionKey, '6::::3000', 'the server we created')
  server.close(t.end)
})
