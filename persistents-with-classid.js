'use strict';

const binding = process._linkedBinding('persistents_with_classid');
const async_wrap = process.binding('async_wrap');

function getProviderValue(k) { return async_wrap.Providers[k] }
const providerIds = Object.keys(async_wrap.Providers).map(getProviderValue);

const visit = exports.visit = function visit(fn, classIds) {
  classIds = classIds || providerIds;
  console.error(classIds)
  binding.visit(fn, classIds);
}

exports.collect = function collect(classIds) {
  const acc = {};
  function onpersistent(classid, obj) {
    if (!acc[classid]) acc[classid] = [];
    acc[classid].push(obj);
  }
  visit(onpersistent, classIds);
  return acc;
}
