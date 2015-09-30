'use strict';

const JSStream = process.binding('js_stream').JSStream;
const persistents = require('../../')
const provider = require('../util/get-provider')('JSSTREAM')

const handle = new JSStream();
const res = persistents.collect()
console.log(res)
