'use strict';

const test = require('tape').test
const spawn = require('child_process').spawn;
const persistents = require('../')
const provider = require('./util/get-provider')('TTYWRAP')

test('\nttywrap: console.log', function (t) {
  // logging to the console creates stderr and stdout
  // and related tty devices
  console.log('')

  const res = persistents.collect()[provider]
  t.equal(res.length, 2, 'finds two tty devices')
  t.ok(res[0].owner.writable, 'that are writable')
  t.ok(res[1].owner.writable, 'that are writable')
  t.ok(!res[0].owner.readable, 'that are not readable')
  t.ok(!res[1].owner.readable, 'that are not readable')
  t.end()
})
