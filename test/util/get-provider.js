'use strict';
const async_wrap = process.binding('async_wrap');

module.exports = function getProvider(providerId) {
  return async_wrap.Providers[providerId]
}
