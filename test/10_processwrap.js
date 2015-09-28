'use strict';

const test = require('tape').test
const spawn = require('child_process').spawn;
const persistents = require('../')
const provider = require('./util/get-provider')('PROCESSWRAP')

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

test('\ngiven a spawned child process', function (t) {
  var sleep = spawn('sleep', [ '0.1' ])

  function onsleepClose(code) {
    t.end()
  }

  sleep.on('close', onsleepClose)

  const res = persistents.collect()
  // many more handles are created, i.e. stdin, stderr, stdout sockets
  // however we are only interested in the processwrap here
  const procinfo = res[provider][0]
  t.deepEqual(procinfo.owner.spawnargs, [ 'sleep', '0.1' ], 'includes child process handle')
})
