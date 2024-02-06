const express = require('express')
const authController = require("../controller/authController")
const bookingController = require("../controller/bookingController")

const router = express.Router()

router.use(authController.protect)

router.route('/checkout-session/:tourId').get(authController.protect,bookingController.getCheckoutSession)

router.use(authController.restrictTo("admin","lead-guide"))

module.exports = router      