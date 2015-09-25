'use strict';

const persistents = require('../persistents-with-classid');
const fs = require('fs');
const fd = fs.openSync(__filename, 'r');
const buf = new Buffer(10);

function onaccess(err) {
  if (err) return console.error(err);
}

function onopen(err) {
  if (err) return console.error(err);
}

function onread(err) {
  if (err) return console.error(err);
}

function onreadFile(err) {
  if (err) return console.error(err);
}

fs.access(__filename, fs.R_OK, onaccess);
fs.open(__filename, 'r', 444, onopen);
fs.read(fd, buf, 1, 6, 10, onread);
fs.readFile(__filename, onreadFile);

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

const result = persistents.collect();
inspect(result, 3)
