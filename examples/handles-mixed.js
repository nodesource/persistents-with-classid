'use strict';

const persistents = require('../persistents-with-classid');
const http = require('http');
const PORT = 3000;
var iv;

// setInterval
function Me() {}
Me.prototype.timeout = function () {
  // assigning to prototype property results in
  // the function name being derived from the
  // prototype name and the property name
  clearInterval(iv);
}
iv = setInterval(new Me().timeout, 100);

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

function onrequest(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('hello world\r\n');

  const result = persistents.collect();
  inspect(result, 2);
}

// setTimeout
var assignedTimeout = function () {
  // here the name the function was assigned to
  // is returned as the function name
}

setTimeout(assignedTimeout, 50);

// http connection
function onlistening() {
  // do nothing, we'll log active handles
  // when we get a request
}

var server = http.createServer();
server
  .on('error', console.error)
  .on('request', onrequest)
  .on('listening', onlistening)
  .listen(PORT);


function onclientResponse(res) {
  server.close();
}

http
  .get('http://localhost:' + PORT)
  .on('error', console.error)
  .on('response', onclientResponse)
