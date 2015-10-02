'use strict';

const test = require('tape').test
const fs = require('fs')
const persistents = require('../')
const provider = require('./util/get-provider')('FSEVENTWRAP')

test('\nfile watcher', function (t) {
  function onwatcherChanged(event, filename) {
    console.log('event is: ' + event);
  }

  function onwatcherError() {
    console.log('watcher encountered error');
  }

  var watcher = fs.watch(__dirname, onwatcherChanged);
  watcher.on('error', onwatcherError)
  const res = persistents.collect()
  const fsevents = res[provider]

  t.equal(fsevents.length, 1, 'one fs event found')
  t.equal(fsevents[0].owner._events.change, onwatcherChanged, 'the registered event')

  watcher.close();
  // watcher cleans up on top of next event loop
  setImmediate(t.end.bind(t));
})
