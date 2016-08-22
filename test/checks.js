'use strict'

const test = require('tape').test
const persistents = require('../')
const provider = require('./util/get-provider')('TIMERWRAP')
const idleNext = require('./util/compat').idleNext
const TIMEOUT = 20

function ontimeout() {}

function withMsecs(ms) {
  return function filter(x) {
    return (x.msecs || x._list.msecs) === ms
  }
}

function ensurePersistent(t, timer, msecs) {
  t.ok(timer, 'includes timer')
  t.equal(idleNext(timer)._onTimeout, undefined, 'no longer refers to user callback')
  t.end()
}

function checkAfterCleared(t, timer, msecs) {
  // the timer should be collectable at this point, so we wait until it's no longer
  // part of the persitents maintained by v8

  const currentRes = persistents.collect()
  if (!currentRes[provider]) return ensurePersistent(t, timer, msecs)

  // timer still part of active handles, wait for it to dissappear
  for (var i = 0; i < msecs.length; i++) {
    const timers = currentRes[provider].filter(withMsecs(msecs[i]))
    if (timers.length) return setImmediate(checkAfterCleared.bind(null, t, timer, msecs))
  }
}

test('\ngiven one setTimeout, accessing persistents on other event loop', function(t) {
  setTimeout(ontimeout, TIMEOUT)

  setImmediate(runTest)
  function runTest() {
    const res = persistents.collect()
    const timer = res[provider].filter(withMsecs(TIMEOUT))[0]
    checkAfterCleared(t, timer, [ TIMEOUT ])
  }
})
