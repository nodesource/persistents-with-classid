'use strict';

const test = require('tape').test
const fs = require('fs')
const tls = require('tls')
const async_wrap = process.binding('async_wrap');
const compat = require('./util/compat')
const setupHooks = compat.setupHooks
const persistents = require('../')
const provider = require('./util/get-provider')('WRITEWRAP')
const PORT = 3000
const fixturesDir = __dirname + '/fixtures';

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}
test('\nwritewrap: tls.creatServer then tls.connect ', function (t) {
  function init(id, p) {
    if (p === provider) {
      const res = persistents.collect()[provider]
      setImmediate(check.bind(null, res))
    }
  }

  function check(res) {
    // this gets called multiple times (each time data is written to a stream?)
    t.equal(res.length, 1, 'one writewrap')
    t.equal(Object.getPrototypeOf(res[0]).constructor.name, 'WriteWrap', 'WriteWrap prototype')
  }

  // only way to catch writewrap is by hooking into async_wrap
  setupHooks(init);
  async_wrap.enable();
  const options = {
    key: fs.readFileSync(fixturesDir + '/ec-key.pem'),
    cert: fs.readFileSync(fixturesDir + '/ec-cert.pem')
  }

  const server = tls.createServer(options).listen(PORT, function() {
    tls.connect(PORT, { rejectUnauthorized: false }, onconnected);
  })

  function onconnected() {
    this.destroy()
    server.close(t.end)
  }
})
