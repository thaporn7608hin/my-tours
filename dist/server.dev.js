"use strict";

var mongoose = require('mongoose');

var dotenv = require('dotenv');

dotenv.config({
  path: './config.env'
});

var app = require('./app');

var DB = process.env.DATABASE.replace('<PASSWORDS>', process.env.PASSWORDS);
(function _callee() {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(mongoose.connect(DB));

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
})().then(function () {
  return console.log("connect success");
})["catch"]("some thing not connect");
var port = 3000;
var server = app.listen(port, 'localhost', function () {
  console.log("Open on port ".concat(port, " success!! >>>>"));
});
process.on('unhandledRejection', function (err) {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(function () {
    process.exit(1);
  });
});
process.on('SIGTERM', function () {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(function () {
    console.log('💥 Process terminated!');
  });
});