"use strict";

require("dotenv").config();

var catchAsync = require('./../utils/catchAsync');

var AppError = require('./../utils/AppError');

var factory = require("./handlerFactory");

var Tour = require('../models/tourModel');

var Booking = require('../models/bookModel');

var stripe = require("stripe")(process.env.API_KEY);

exports.getCheckoutSession = catchAsync(function _callee(req, res, next) {
  var tour, session;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Tour.findById(req.params.tourId));

        case 2:
          tour = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(stripe.checkout.sessions.create({
            line_items: [{
              price_data: {
                currency: 'thb',
                unit_amount: tour.price * 100,
                product_data: {
                  name: "".concat(tour.name, " Tour"),
                  description: tour.summary,
                  images: ["https://www.natours.dev/img/tours/".concat(tour.imageCover)]
                }
              },
              quantity: 1
            }],
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: "".concat(req.protocol, "://").concat(req.get("host"), "/?tour=").concat(req.params.tourId, "&user=").concat(req.user.id, "&price=").concat(tour.price),
            cancel_url: "".concat(req.protocol, "://").concat(req.get("host"), "/tour/").concat(tour.name),
            customer_email: req.user.email,
            client_reference_id: req.params.tourId
          }));

        case 5:
          session = _context.sent;
          res.status(200).json({
            status: 'success',
            session: session
          });

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
});

exports.createBookingCheckout = function _callee2(req, res, next) {
  var _req$query, tour, user, price;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$query = req.query, tour = _req$query.tour, user = _req$query.user, price = _req$query.price;

          if (!(!tour && !user && !price)) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", next());

        case 3:
          _context2.next = 5;
          return regeneratorRuntime.awrap(Booking.create({
            tour: tour,
            user: user,
            price: price
          }));

        case 5:
          res.redirect(req.originalUrl.split("?")[0]);

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.getAllBook = factory.getAll(Booking);
exports.getBook = factory.getOne(Booking);
exports.createBook = factory.createOne(Booking);
exports.updateBook = factory.updateOne(Booking);
exports.deleteBook = factory.deleteOne(Booking);