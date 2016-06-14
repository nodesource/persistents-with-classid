'use strict';

const test = require('tape').test
const persistents = require('../')
const providers = require('./util/get-provider')
const idleNext = require('./util/compat').idleNext
const provider = providers('TIMERWRAP')
const TIMEOUT = 20

test('\na promise resolving when setTimeout elapssed', function (t) {
  const expectedIs = [ 'SIGNALWRAP', 'TIMERWRAP', 'TTYWRAP' ]

  function ondone() { t.end() }

  function onpromise(resolve, reject) {
    resolve.itsme = true;
    setTimeout(resolve, TIMEOUT);
    setImmediate(runTest)
  }

  const promise = new Promise(onpromise)
  promise.then(ondone)

  function runTest() {
    const res = persistents.collect()
    const providerIds = Object.keys(res).map(providers.fromKey)
    const timers = res[provider]
    const timer = timers[0]
    t.equal(timers.length, 1, 'finds one timer')
    t.ok(idleNext(timer)._onTimeout.itsme, 'the timeout is the promise resolve function')

    t.deepEqual(providerIds, expectedIs, 'only finds expeced ids ' + expectedIs)
  }
})
