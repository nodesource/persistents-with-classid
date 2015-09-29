'use strict';

const binding = process.versions.nsolid
  ? process._linkedBinding('persistents_with_classid')
  : require('bindings')('persistents_with_classid');

/**
 * Visits all persistents with class id and calls back with the ones that
 * the user is interested in.
 *
 * @name persistents_with_classid::visit
 * @function
 * @param {Function} fn function called with each Object matching the class id filter
 *                      with signature: `callback(classid, object)`
 * @param {Array=} classIds filter of class ids of Objects to call back with, defaults to async_wrap providers
 */
const visit = exports.visit = function visit(fn, classIds) {
  if (typeof fn !== 'function')
    throw new TypeError('First argument needs to be a Function');

  if (!classIds)
    return binding.visit(fn, -1 >>> 0);

  if (!Array.isArray(classIds))
    throw new TypeError('Second argument needs to be an Array');

  let ids = 0;
  for (let i = 0; i < classIds.length; i++) {
    ids += classIds[i] << 1;
  }

  return binding.visit(fn, ids);
}

/**
 * Visits all persistents with class id and collects them grouped by class id.
 *
 * @name persistents_with_classid::collect
 * @function
 * @param {Array=} classIds filter of class ids of Objects to call back with, defaults to async_wrap providers
 * @return {Object} a hash table keyed by class ids with each value being an array of objects with that class id
 *                  i.e.: `{ classid-x: [ object, object ] }`
 */
exports.collect = function collect(classIds) {
  const acc = {};
  function onpersistent(classid, obj) {
    if (!acc[classid]) acc[classid] = [];
    acc[classid].push(obj);
  }
  visit(onpersistent, classIds);
  return acc;
}
