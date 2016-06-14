'use strict';

const test = require('tape').test
const persistents = require('../')
const provider = require('./util/get-provider')('TIMERWRAP')
const idleNext = require('./util/compat').idleNext
const TIMEOUT = 20
const TIMEOUT_PLUS = 20 + 5

function withMsecs(ms) {
  return function filter(x) {
    return (x.msecs || x._list.msecs) === ms
  }
}

function endAfterCleared(t, msecs) {
  // ensure that tests don't affect each other by waiting for all
  // timers that might still be around to clear
  const res = persistents.collect()
  if (!res[provider]) return t.end()
  for (var i = 0; i < msecs.length; i++) {
    const timers = res[provider].filter(withMsecs(msecs[i]))
    if (timers.length) return setImmediate(endAfterCleared.bind(null, t, msecs))
  }
  t.end()
}

test('\none setTimeout', function (t) {
  function timeout() { endAfterCleared(t, [ TIMEOUT ]) }

  setTimeout(timeout, TIMEOUT);

  setImmediate(runTest)
  function runTest() {
    const res = persistents.collect()
    const timer = res[provider].filter(withMsecs(TIMEOUT))[0]

    t.equal(idleNext(timer)._onTimeout, timeout, 'includes timer')
  }
})

test('\ntwo setTimeouts', function (t) {
  function timeoutUno() { /* nada */ }
  function timeoutDos() { endAfterCleared(t, [ TIMEOUT, TIMEOUT_PLUS ]) }

  setTimeout(timeoutUno, TIMEOUT);
  setTimeout(timeoutDos, TIMEOUT_PLUS);

  setImmediate(runTest)
  function runTest() {
    const res = persistents.collect()
    const timerUno = res[provider].filter(withMsecs(TIMEOUT))[0]
    const timerDos = res[provider].filter(withMsecs(TIMEOUT_PLUS))[0]

    t.equal(idleNext(timerUno)._onTimeout, timeoutUno, 'includes first timer')
    t.equal(idleNext(timerDos)._onTimeout, timeoutDos, 'includes second timer')
  }
})

test('\none setInterval', function (t) {
  var iv
  function interval() { clearInterval(iv); endAfterCleared(t, [ TIMEOUT ]) }

  iv = setInterval(interval, TIMEOUT);

  setImmediate(runTest)
  function runTest() {
    const res = persistents.collect()
    const timer = res[provider].filter(withMsecs(TIMEOUT))[0]

    t.equal(idleNext(timer)._repeat, interval, 'includes timer')
  }
})

test('\ntwo setIntervals', function (t) {
  var ivuno, ivdos
  function intervalUno() { clearInterval(ivuno) }
  function intervalDos() {
    clearInterval(ivdos);
    endAfterCleared(t, [ TIMEOUT, TIMEOUT_PLUS ]);
  }

  ivuno = setInterval(intervalUno, TIMEOUT);
  ivdos = setInterval(intervalDos, TIMEOUT_PLUS);

  setImmediate(runTest)
  function runTest() {
    const res = persistents.collect()
    const timerUno = res[provider].filter(withMsecs(TIMEOUT))[0]
    const timerDos = res[provider].filter(withMsecs(TIMEOUT_PLUS))[0]

    t.equal(idleNext(timerUno)._repeat, intervalUno, 'includes first timer')
    t.equal(idleNext(timerDos)._repeat, intervalDos, 'includes second timer')
  }
})
