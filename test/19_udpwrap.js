'use strict';

const test = require('tape').test
var dgram = require('dgram')
const persistents = require('../')
const provider = require('./util/get-provider')('UDPWRAP')

test('\nudpwrap: dgram.createSocket', function (t) {
  const sock = dgram.createSocket('udp4')
  const res = persistents.collect()[provider]
  t.equal(res.length, 1, 'finds one udpwrap')
  t.equal(res[0].owner.type, 'udp4', 'udp4 type')
  sock.close(t.end)
})
