"use strict";

var express = require('express');

var authController = require("../controller/authController");

var bookingController = require("../controller/bookingController");

var router = express.Router();
router.use(authController.protect);
router.route('/checkout-session/:tourId').get(authController.protect, bookingController.getCheckoutSession);
router.use(authController.restrictTo("admin", "lead-guide"));
module.exports = router;