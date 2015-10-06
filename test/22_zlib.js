'use strict';

const test = require('tape').test
const zlib = require('zlib')
const persistents = require('../')
const provider = require('./util/get-provider')('ZLIB')

test('\nzlib: zlib.createGzip', function (t) {
  zlib.createGzip();
  const res = persistents.collect()[provider]
  t.equal(res.length, 1, 'one zlib')
  t.equal(Object.getPrototypeOf(res[0]).constructor.name, 'Zlib', 'Zlib prototype')
  t.end()
})
