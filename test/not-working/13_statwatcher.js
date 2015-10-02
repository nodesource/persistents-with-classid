'use strict';

const test = require('tape').test
const fs = require('fs')
const persistents = require('../../')
const provider = require('../util/get-provider')('STATWATCHER')

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

function onchange(curr, prev) { }

// should start statwatcher at which point it should've created
// the STATWATCHER persistent
const stat = fs.watch(__filename, { persistent: false }, onchange)
const res = persistents.collect()[provider]
inspect(res)

setTimeout(onwaited, 100)

function onwaited() {
  // or at least at this point it should've created one
  const res = persistents.collect()[provider]
  inspect(res)
}
