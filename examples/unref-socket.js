'use strict';

const explanation = `
Explanation
===========

This example demonstrates how unref-ing a pending operation, in this case a UDP socket
affects its querability via _getActiveHandles vs. v8 persistents API.

When a pending operation is unrefd a flag is set on the C++ layer indicating this state.
When _getActiveHandles walks the list of active handles it omits the ones that have the
unrefd flag set and therefore doesn't return it as part of the results.
`

const persistents = require('../persistents-with-classid');
const dgram = require('dgram');

function onsent(err) { }
const sock = dgram.createSocket('udp4');

// NOTE:  in case no message is queued, the process exits even if we don't unref the socket
const msg = new Buffer('hello')
sock.send(msg, 0, msg.length, 41234, 'localhost', onsent)

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

const pers1 = persistents.collect();
const handles1 = process._getActiveHandles()
sock.unref()
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
