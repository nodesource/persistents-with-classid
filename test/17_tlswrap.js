'use strict';

const test = require('tape').test
const fs = require('fs')
const tls = require('tls')
const persistents = require('../')
const provider = require('./util/get-provider')('TLSWRAP')
const PORT = 3000
const fixturesDir = __dirname + '/fixtures';

test('\ntlswrap: tls.creatServer then tls.connect ', function (t) {
  const options = {
    key: fs.readFileSync(fixturesDir + '/ec-key.pem'),
    cert: fs.readFileSync(fixturesDir + '/ec-cert.pem')
  }

  const server = tls.createServer(options).listen(PORT, function() {
    tls.connect(PORT, { rejectUnauthorized: false }, onconnected);
    const res = persistents.collect()[provider]
    t.equal(res.length, 1, 'initially one tlswrap')
  })

  function onconnected() {
    const res = persistents.collect()[provider]
    t.equal(res.length, 2, 'after connected two tlswraps')
    t.equal(res[0].owner.server.key, options.key, 'the first one is the server we created')
    this.destroy()
    server.close(t.end)
  }
})
