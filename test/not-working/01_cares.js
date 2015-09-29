'use strict';

const test = require('tape').test
const dns = require('dns')
const cares = process.binding('cares_wrap')
const persistents = require('../../')
const provider = require('../util/get-provider')('CARES')

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

test('\nhello', function (t) {
  function onlookup() { t.end() }
  dns.lookup('google.com',  onlookup)

  // XXX: should have a cares provider at this point but doesn't
  const res = persistents.collect()[provider]
  inspect(res)
})
