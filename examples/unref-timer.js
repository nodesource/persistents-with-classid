'use strict';

const persistents = require('../persistents-with-classid');

var iv1
function onTimeout() {
  // here the function declaration is named, easy enough
  clearInterval(iv1);
}

iv1 = setInterval(onTimeout, 20);

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

const pers1 = persistents.collect();
const handles1 = process._getActiveHandles()
iv1.unref()
const pers2 = persistents.collect();
const handles2 = process._getActiveHandles()

console.log('Persistents')
inspect(pers1)
console.log('Handles')
inspect(handles1)
console.log('Persistents (unrefd)')
inspect(pers2)
console.log('Handles (unrefd)')
inspect(handles2)
