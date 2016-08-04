'use strict'

const major = require('./node-major')
const minor = require('./node-minor')
const async_wrap = process.binding('async_wrap')

// node compatibility convenience functions

exports.idleNext = function idleNext (timer) {
  return (
    // node v4
    timer._idleNext ||
    // node v6
    (timer._list && timer._list._idleNext)
  )
}

// we are using the node v6 API, but in case
// we run with v4 we adapt the init function
function adaptInit (init) {
  function adaptedInit (p) {
    return init('__adapted id__', p)
  }
  // node 4.5 has backported async_wrap changes
  if (major.le4 && minor.minor < 5) return adaptedInit
  return init
}

function noop () {}
// we are using the node v6 API as much as we can with supported ES6 in v4, but in case
// we run with v4 we adapt the call to the setupHooks function
exports.setupHooks = function setupHooks (init) {
  if (major.le4 && minor.minor < 5) {
    async_wrap.setupHooks(adaptInit(init), noop, noop)
  } else if (major.le6) {
    async_wrap.setupHooks({ init })
  }
}

