'use strict';

var binding = process._linkedBinding('persistents_with_classid');

var visit = exports.visit = function visit(fn) {
  binding.visit(fn);
}

exports.collect = function collect() {
  var acc = {};
  function onpersistent(classid, obj) {
    if (!acc[classid]) acc[classid] = [];
    acc[classid].push(obj);
  }
  visit(onpersistent);
  return acc;
}
