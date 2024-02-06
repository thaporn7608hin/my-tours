"use strict";

var express = require("express");

var viewsController = require("../controller/viewsController");

var authController = require("../controller/authController");

var bookingController = require("../controller/bookingController");

var CSP = 'Content-Security-Policy';
var POLICY = "default-src 'self' https://*.mapbox.com;" + "base-uri 'self';" + "block-all-mixed-content;" + "connect-src 'self' https://api.mapbox.com https://events.mapbox.com ws://localhost:64867;" + "font-src 'self' https: data:;" + "frame-ancestors 'self';" + "img-src http://localhost:3000 'self' blob: data:;" + "object-src 'none';" + "script-src https: cdn.jsdelivr.net cdnjs.cloudflare.com api.mapbox.com 'self' blob: ;" + "script-src-attr 'none';" + "style-src 'self' https: 'unsafe-inline';" + "upgrade-insecure-requests;" + "frame-src 'self' https://*.mapbox.com https://js.stripe.com/";
var router = express.Router();
router.use(function (req, res, next) {
  res.setHeader(CSP, POLICY);
  next();
});
router.get("/", bookingController.createBookingCheckout, authController.isLoggedIn, viewsController.getOverview);
router.get("/tour/:name", authController.isLoggedIn, authController.protect, viewsController.getTour);
router.get("/login", authController.isLoggedIn, viewsController.getLoginFrom);
router.get("/me", authController.protect, viewsController.getAccount);
router.get("/my-tours", authController.protect, viewsController.getMyTour);
router.post("/submit-user-data", authController.protect, viewsController.updateUserData);
module.exports = router;