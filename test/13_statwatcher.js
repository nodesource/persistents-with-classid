'use strict';

const test = require('tape').test
const fs = require('fs')
const persistents = require('../')
const provider = require('./util/get-provider')('STATWATCHER')

function onchange(curr, prev) { }

// Starts statwatcher at which point it creates the STATWATCHER persistent
test('\nstatwatcher: fs.watchFile', function (t) {
  fs.watchFile(__filename, onchange);
  fs.unwatchFile(__filename);
  const res = persistents.collect()[provider][0]

  t.equal(Object.getPrototypeOf(res).constructor.name, 'StatWatcher', 'is a StatWatcher')
  t.equal(typeof res.onstop, 'function', 'has onstop function')
  t.equal(typeof res.onchange, 'function', 'has onchange function')
  t.notEqual(res.onchange, onchange, 'onchange function is defined in core')
  t.end()
})
