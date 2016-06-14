'use strict'

const major = exports.major = parseInt(process.version[1])

exports.is4 = major === 4
exports.is6 = major === 6

exports.ge4 = major >= 4
exports.ge6 = major >= 6

exports.g4 = major > 4
exports.g6 = major > 6

exports.le4 = major <= 4
exports.le6 = major <= 6

exports.l4 = major < 4
exports.l6 = major < 6
