"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var AppError = require('./../utils/AppError');

var handleErrorDB = function handleErrorDB(err) {
  console.log(err);
  var message = "Invalid ".concat(err.path, " : ").concat(err.value);
  return new AppError(message, 404);
};

var sentErrorDev = function sentErrorDev(err, req, res) {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: err.message
    });
  }
};

var sentErrorProduction = function sentErrorProduction(err, req, res) {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
  } else {
    if (err.isOperational) {
      return res.status(err.statusCode).render("error", {
        title: "Something went wrong!",
        msg: err.message
      });
    } else {
      return res.status(err.statusCode).render("error", {
        title: "Something went wrong!",
        msg: "Please try again later."
      });
    }
  }
};

var handleDuplicateFields = function handleDuplicateFields(err) {
  var value = err.keyValue.name;
  var message = "Duplicate field value: /{".concat(value, "}/ Please use another value!");
  return new AppError(message, 400);
};

var handleValidationErrorDB = function handleValidationErrorDB(err) {
  var error = Object.values(err.errors).map(function (el) {
    return el.message;
  });
  var message = "invalid input data ".concat(error.join('. '));
  return new AppError(message, 400);
};

var handleJWTError = function handleJWTError() {
  return new AppError("Invalid token please log in again!", 401);
};

var handleExpiredError = function handleExpiredError() {
  return new AppError("Your token has expired. please log in again!", 401);
};

module.exports = function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';

  if (process.env.NODE_ENV === 'development') {
    sentErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    var error = _objectSpread({}, err);

    if (err.name === 'CastError') error = handleErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFields(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === "JsonWebTokenError") error = handleJWTError(error);
    if (err.name === "TokenExpiredError") error = handleExpiredError(error);
    sentErrorProduction(err, req, res);
  }
};