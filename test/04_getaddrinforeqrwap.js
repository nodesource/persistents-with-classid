'use strict';

const test = require('tape').test
const dns = require('dns')
const persistents = require('../')
const provider = require('./util/get-provider')('GETADDRINFOREQWRAP')

test('\ngetaddrinforeqwrap: dns.lookup', function (t) {
  function onlookup(err, ip, family) { t.end() }

  var req = dns.lookup('www.google.com', 4, onlookup)

  const res = persistents.collect()[provider]

  t.equal(res.length, 1, 'one get addrinfo request found')
  t.equal(res[0].hostname, 'www.google.com', 'the dns.lookup request')
})
