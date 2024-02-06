"use strict";

var crypto = require("crypto");

var _require = require("util"),
    promisify = _require.promisify;

var User = require("./../models/userModel");

var catchAsync = require("./../utils/catchAsync");

var jwt = require("jsonwebtoken");

var AppError = require("./../utils/AppError");

var Email = require("../utils/email");

var signToken = function signToken(id) {
  var token = jwt.sign({
    id: id
  }, process.env.JSON_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  return token;
};

var createSentToken = function createSentToken(user, statusCode, res) {
  var token = signToken(user.id);
  var cookieiOption = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  if (process.env.NODE_ENV === "production") cookieiOption.secure = true;
  res.cookie('jwt', token, cookieiOption);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token: token,
    data: {
      user: user
    }
  });
};

exports.singup = catchAsync(function _callee(req, res, next) {
  var newUser, url;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(User.create(req.body));

        case 2:
          newUser = _context.sent;
          url = "".concat(req.protocol, "://").concat(req.get("host"), "/me");
          _context.next = 6;
          return regeneratorRuntime.awrap(new Email(newUser, url).sendWelcome());

        case 6:
          createSentToken(newUser, 200, res);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.login = catchAsync(function _callee2(req, res, next) {
  var _req$body, email, password, user;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, password = _req$body.password; // 1) Check if email and password exist

          if (!(!email || !password)) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", next(new AppError('Please provide email and password!', 400)));

        case 3:
          _context2.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }).select('+password'));

        case 5:
          user = _context2.sent;
          _context2.t0 = !user;

          if (_context2.t0) {
            _context2.next = 11;
            break;
          }

          _context2.next = 10;
          return regeneratorRuntime.awrap(user.correctPassword(password, user.password));

        case 10:
          _context2.t0 = !_context2.sent;

        case 11:
          if (!_context2.t0) {
            _context2.next = 13;
            break;
          }

          return _context2.abrupt("return", next(new AppError('Incorrect email or password', 401)));

        case 13:
          createSentToken(user, 200, res);

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  });
});

exports.logout = function (req, res, next) {
  console.log("LOGOUT");
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({
    status: 'success'
  });
};

exports.isLoggedIn = function _callee3(req, res, next) {
  var decoded, currentUser;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!req.cookies.jwt) {
            _context3.next = 19;
            break;
          }

          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(promisify(jwt.verify)(req.cookies.jwt, process.env.JSON_SECRET));

        case 4:
          decoded = _context3.sent;
          _context3.next = 7;
          return regeneratorRuntime.awrap(User.findById(decoded.id));

        case 7:
          currentUser = _context3.sent;

          if (currentUser) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", next());

        case 10:
          if (!currentUser.changedPasswordAfter(decoded.iat)) {
            _context3.next = 12;
            break;
          }

          return _context3.abrupt("return", next());

        case 12:
          res.locals.user = currentUser;
          return _context3.abrupt("return", next());

        case 16:
          _context3.prev = 16;
          _context3.t0 = _context3["catch"](1);
          return _context3.abrupt("return", next());

        case 19:
          next();

        case 20:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 16]]);
};

exports.protect = catchAsync(function _callee4(req, res, next) {
  var token, decoded, freshUser;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(' ')[1];
          } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
          }

          if (token) {
            _context4.next = 3;
            break;
          }

          return _context4.abrupt("return", next(new AppError("You are not logged in! please log in to get access.", 401)));

        case 3:
          _context4.next = 5;
          return regeneratorRuntime.awrap(promisify(jwt.verify)(token, process.env.JSON_SECRET));

        case 5:
          decoded = _context4.sent;
          _context4.next = 8;
          return regeneratorRuntime.awrap(User.findById(decoded.id));

        case 8:
          freshUser = _context4.sent;

          if (freshUser) {
            _context4.next = 11;
            break;
          }

          return _context4.abrupt("return", next(new AppError("The user belonging to this token does no longer exist.", 404)));

        case 11:
          if (!freshUser.changedPasswordAfter(decoded.iat)) {
            _context4.next = 13;
            break;
          }

          return _context4.abrupt("return", next(new AppError("user recently changed password! please log in again."), 401));

        case 13:
          req.user = freshUser;
          res.locals.user = freshUser;
          next();

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  });
});

exports.restrictTo = function () {
  for (var _len = arguments.length, roles = new Array(_len), _key = 0; _key < _len; _key++) {
    roles[_key] = arguments[_key];
  }

  return function (req, res, next) {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
};

exports.forgotPassword = catchAsync(function _callee5(req, res, next) {
  var user, resetToken, resetUrl, message;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }));

        case 2:
          user = _context5.sent;

          if (user) {
            _context5.next = 5;
            break;
          }

          return _context5.abrupt("return", next(new AppError("There is no user with email address.", 404)));

        case 5:
          _context5.next = 7;
          return regeneratorRuntime.awrap(user.createPasswordResetToken());

        case 7:
          resetToken = _context5.sent;
          _context5.next = 10;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 10:
          resetUrl = "".concat(req.protocol, "://").concat(req.get("host"), "/api/v1/users/resetPassword/").concat(resetToken);
          message = "Forgot your passwor? Submit a PATCH request with your new password and passwordConfirm to:".concat(resetUrl, ".\n if you did't forget your password and\n    password, please ignore this email:");
          _context5.next = 14;
          return regeneratorRuntime.awrap(new Email(user, resetUrl).sentPasswordReset());

        case 14:
          res.status(200).json({
            status: "success",
            message: "token sent to email"
          });

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  });
});
exports.resetPassword = catchAsync(function _callee6(req, res, next) {
  var hashedToken, user;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
          _context6.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpired: {
              $gt: Date.now()
            }
          }));

        case 3:
          user = _context6.sent;

          if (user) {
            _context6.next = 6;
            break;
          }

          return _context6.abrupt("return", next(new AppError("Token is invalid or hash expired", 400)));

        case 6:
          user.password = req.body.password;
          user.passwordConfirm = req.body.passwordConfirm;
          user.passwordResetToken = undefined;
          user.passwordResetExpired = undefined;
          _context6.next = 12;
          return regeneratorRuntime.awrap(user.save());

        case 12:
          createSentToken(user, 200, res);

        case 13:
        case "end":
          return _context6.stop();
      }
    }
  });
});
exports.updatePassword = catchAsync(function _callee7(req, res, next) {
  var user, token;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(User.findById(req.user.id).select("+password"));

        case 2:
          user = _context7.sent;
          _context7.next = 5;
          return regeneratorRuntime.awrap(user.correctPassword(req.body.passwordCurrent, user.password));

        case 5:
          if (_context7.sent) {
            _context7.next = 7;
            break;
          }

          return _context7.abrupt("return", next(new AppError("Your current password is wrong.", 401)));

        case 7:
          user.password = req.body.password;
          user.passwordConfirm = req.body.passwordConfirm;
          _context7.next = 11;
          return regeneratorRuntime.awrap(user.save());

        case 11:
          token = signToken(user.id);
          res.status(200).json({
            status: "success",
            token: token
          });

        case 13:
        case "end":
          return _context7.stop();
      }
    }
  });
});