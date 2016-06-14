'use strict'

// node compatibility convenience functions

exports.idleNext = function idleNext (timer) {
  return (
    // node v4
    timer._idleNext ||
    // node v6
    (timer._list && timer._list._idleNext)
  )
}
