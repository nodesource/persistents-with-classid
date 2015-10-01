'use strict';

const test = require('tape').test
const dns = require('dns')
const persistents = require('../..')
const provider = require('../util/get-provider')('QUERYWRAP')

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

function onreverse(err, domains) {
  const res = persistents.collect()[provider]
  inspect(res)
}

var req = dns.reverse('128.0.0.1', onreverse)
const res = persistents.collect()[provider]
inspect(res)
