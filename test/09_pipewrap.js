'use strict';

const test = require('tape').test
const spawn = require('child_process').spawn;
const persistents = require('../')
const provider = require('./util/get-provider')('PIPEWRAP')
const STDIN = 0
const STDOUT = 1
const STDERR = 2

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
  // a child process gets a 3 pipes (sockets) installed for communication - std{in,err,out}
  const pipes = res[provider]
  t.equal(pipes.length, 3, 'three pipes')
  t.ok(!pipes[STDIN].owner.readable, 'stdin not readable')
  t.ok(pipes[STDIN].owner.writable, 'stdin writable')
  t.ok(pipes[STDOUT].owner.readable, 'stdout readable')
  t.ok(!pipes[STDOUT].owner.writable, 'stdout not writable')
  t.ok(pipes[STDERR].owner.readable, 'stderr readable')
  t.ok(!pipes[STDERR].owner.writable, 'stderr not writable')
})
