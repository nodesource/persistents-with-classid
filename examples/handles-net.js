'use strict';

const persistents = require('../persistents-with-classid');
const async_wrap = process.binding('async_wrap');

var net = require('net');
var PORT = 3000;

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

function onconnect(c) {
  c.write('hello world\r\n');
  c.pipe(c);

  const result = persistents.collect();
  inspect(result, 5);
}

function onlistening() {
  console.error('Listening on localhost %d', PORT);
}

var server = net.createServer()
server
  .on('connection', onconnect)
  .on('error', console.error)
  .on('listening', onlistening)
  .listen(PORT)

function onclientConnect() {
  client.write('hola mundo\r\n');
}

function onclientData(data) {
  console.log('\n\n--------------\n%s', data.toString());
  client.end();
}

function onclientEnd() {
  console.log('disconnected from server');
  server.close();
}

var client =  net
  .connect({ port: PORT })
  .on('error', console.error)
  .on('connection', onclientConnect)
  .on('data', onclientData)
  .on('end', onclientEnd);
