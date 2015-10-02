'use strict';

const test = require('tape').test
const dns = require('dns')
const persistents = require('../')
const provider = require('./util/get-provider')('GETNAMEINFOREQWRAP')

test('\ngetnameinforeqwrap: dns.lookupService', function (t) {
  function onlookupService(err, host, service) { t.end() }
  dns.lookupService('127.0.0.1', 80, onlookupService)

  const res = persistents.collect()[provider]
  t.equal(res.length, 1, 'one get nameinfo request found')
  t.equal(res[0].host, '127.0.0.1', 'the dns.lookupService request')
})
