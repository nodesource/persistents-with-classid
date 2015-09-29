const test = require('tape').test
const crypto = require('crypto')
const persistents = require('../../')
const provider = require('../util/get-provider')('CRYPTO')

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

test('\ncrypto: pbkdf2', function (t) {
  function onpbkdf2(err, buf) { t.end() }

  crypto.pbkdf2('password', 'salt', 1, 20, onpbkdf2);

  // XXX: should have a crypto provider at this point but doesn't
  const res = persistents.collect()[provider]
  inspect(res)
})
