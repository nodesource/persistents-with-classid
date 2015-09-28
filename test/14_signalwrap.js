'use strict';

const test = require('tape').test
const persistents = require('../')
const provider = require('./util/get-provider')('SIGNALWRAP')

function onsigusr2() { }
process.on('SIGUSR2', onsigusr2)
// query here since once we call test( function
// tape registers it's own handler
const res = persistents.collect()[provider]

test('\nsignalwrap, given a SIGUSR2 signal handler', function (t) {
  t.equal(res.length, 1, 'on signal handler')
  t.equal(typeof res[0].onsignal, 'function', 'that is a function')
  t.end()
})
