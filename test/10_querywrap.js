'use strict';

const test = require('tape').test
const dns = require('dns')
const persistents = require('../')
const provider = require('./util/get-provider')('QUERYWRAP')

test('\nquerywrap: dns.resolve', function (t) {
  function onresolved() { t.end() }
  // uses cares for queryA which in turn uses QUERYWRAP
  dns.resolve('localhost', onresolved);
  const res = persistents.collect()[provider]
  t.equal(res.length, 1, 'one querywrap')
  t.equal(res[0].hostname, 'localhost', 'for dns.resolve we called')
})
