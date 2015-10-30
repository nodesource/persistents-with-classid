'use strict';

const test        = require('tape').test
const crypto      = require('crypto');
const persistents = require('../')
const provider    = require('./util/get-provider')('CRYPTO')

test('\ncrypto: crypto.randomBytes', function (t) {
  function onrandomBytes() {
    const res = persistents.collect()[provider]
    t.equal(res.length, 1, 'one crypto')
    t.equal(Object.getPrototypeOf(res[0]).constructor.name, 'InternalFieldObject', 'InternalFieldObject prototype')
    t.end()
  }
  crypto.randomBytes(1, onrandomBytes);
})
