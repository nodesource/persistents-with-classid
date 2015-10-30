'use strict';

const test = require('tape').test
const persistents = require('../')
const StreamWrap = require('_stream_wrap').StreamWrap;
const fs = require('fs')
const provider = require('./util/get-provider')('JSSTREAM')

test('\njsstream: wrapping a stream via StreamWrap', function (t) {
  const streamWrap = new StreamWrap(fs.createReadStream(__filename))
  const res = persistents.collect()[provider]
  t.equal(res.length, 1, 'one JSStream')
  t.equal(res[0].owner.stream.path, __filename, 'the wrapped stream')
  t.end()
  // somehow the stream wrap keeps the process alive, so we force quit it here
  process.reallyExit()
})
