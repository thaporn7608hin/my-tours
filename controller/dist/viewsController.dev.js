"use strict";

var Tour = require('../models/tourModel');

var catchAsync = require("../utils/catchAsync");

var AppError = require("../utils/AppError");

var User = require('../models/userModel');

var Booking = require('../models/bookModel');

exports.getOverview = catchAsync(function _callee(req, res) {
  var tours, date;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Tour.find());

        case 2:
          tours = _context.sent;
          date = tours[0].startDates[0].toLocaleString('en-us', {
            month: 'long',
            year: 'numeric'
          });
          res.status(200).render('overview', {
            title: "All Tours",
            tours: tours
          });

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.getTour = catchAsync(function _callee2(req, res) {
  var tour;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Tour.findOne({
            name: req.params.name
          }).populate({
            path: 'reviews',
            fields: 'review rating user'
          }));

        case 2:
          tour = _context2.sent;

          if (tour) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", next(new AppError('There is no tour with that name.', 404)));

        case 5:
          res.status(200).render('tour', {
            title: "".concat(tour.name, " tour"),
            tour: tour
          });

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports.getLoginFrom = catchAsync(function _callee3(req, res, next) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          res.status(200).render('login', {
            title: 'Login into your account'
          });

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.getAccount = catchAsync(function _callee4(req, res, next) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          res.status(200).render("account", {
            title: "Your account"
          });

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
});
exports.updateUserData = catchAsync(function _callee5(req, res, next) {
  var updateUser;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, {
            name: req.body.name,
            email: req.body.email
          }, {
            "new": true,
            runValidators: true
          }));

        case 2:
          updateUser = _context5.sent;
          res.status(200).render("account", {
            title: "Your account",
            user: updateUser
          });

        case 4:
        case "end":
          return _context5.stop();
      }
    }
  });
});
exports.getMyTour = catchAsync(function _callee6(req, res, next) {
  var booking, tourID, tours;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(Booking.find({
            user: req.user.id
          }));

        case 2:
          booking = _context6.sent;
          tourID = booking.map(function (el) {
            return el.tour;
          });
          _context6.next = 6;
          return regeneratorRuntime.awrap(Tour.find({
            _id: {
              $in: tourID
            }
          }));

        case 6:
          tours = _context6.sent;
          res.status(200).render("overview", {
            title: "My Tours",
            tours: tours
          });

        case 8:
        case "end":
          return _context6.stop();
      }
    }
  });
});