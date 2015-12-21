'use strict';

const explanation = `
Explanation
===========

This example demonstrates how unref-ing a pending operation, in this case a server
affects its querability via _getActiveHandles vs. v8 persistents API.

When a pending operation is unrefd a flag is set on the C++ layer indicating this state.
When _getActiveHandles walks the list of active handles it omits the ones that have the
unrefd flag set and therefore doesn't return it as part of the results.
`

const persistents = require('../persistents-with-classid');
const net = require('net');
const PORT = process.env.PORT || 8888

function onconnected(sock) {
  console.log("opened server on %j", server.address());
}

var server = net
  .createServer(onconnected)
  .listen({ port: PORT })

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

const pers1 = persistents.collect();
const handles1 = process._getActiveHandles()
server.unref()
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

console.log(explanation)
