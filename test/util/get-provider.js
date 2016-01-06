'use strict';
const async_wrap = process.binding('async_wrap');

const providersByKey = Object.keys(async_wrap.Providers)
  .reduce(function byKey(acc, id) {
    acc[async_wrap.Providers[id]] = id
    return acc
  }, {})

exports = module.exports = function getProvider(providerId) {
  return async_wrap.Providers[providerId]
}

exports.fromKey = function fromKey(key) {
  return providersByKey[key]
}
