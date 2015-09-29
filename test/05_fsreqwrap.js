'use strict';

const test = require('tape').test
const fs = require('fs')
const persistents = require('../')
const provider = require('./util/get-provider')('FSREQWRAP')

test('\nfsreqwrap: fs.access', function (t) {
  function onaccess() { t.end() }
  fs.access(__filename, onaccess)

  const res = persistents.collect()[provider]
  t.equal(res.length, 1, 'one FSREQWRAP')
  t.equal(Object.getPrototypeOf(res[0]).constructor.name, 'FSReqWrap')

  // only nsolid adds a context to each fs operation at this point
  if (res[0].context) t.equal(res[0].context.path, __filename, 'for fs.access')
})

test('\nfsreqwrap: fs.readFile', function (t) {
  function onread() { t.end() }
  fs.readFile(__filename, onread)

  const res = persistents.collect()[provider]
  t.equal(res.length, 1, 'one FSREQWRAP')
  t.equal(Object.getPrototypeOf(res[0]).constructor.name, 'FSReqWrap')

  t.equal(Object.getPrototypeOf(res[0].context).constructor.name, 'ReadFileContext', 'for fs.readFile')
})

test('\nfsreqwrap: fs.readdir', function (t) {
  function onread() { t.end() }
  fs.readdir(__dirname, onread)

  const res = persistents.collect()[provider]
  t.equal(res.length, 1, 'one FSREQWRAP')
  t.equal(Object.getPrototypeOf(res[0]).constructor.name, 'FSReqWrap')

  if (res[0].context) t.equal(res[0].context.path, __dirname, 'for fs.readdir')
})
