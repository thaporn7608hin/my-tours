const express = require("express")
const viewsController = require("../controller/viewsController")
const authController = require("../controller/authController")
const bookingController = require("../controller/bookingController")
const CSP = 'Content-Security-Policy';
const POLICY =
  "default-src 'self' https://*.mapbox.com;" +
  "base-uri 'self';" +
  "block-all-mixed-content;" +
  "connect-src 'self' https://api.mapbox.com https://events.mapbox.com ws://localhost:64867;" +
  "font-src 'self' https: data:;" +
  "frame-ancestors 'self';" +
  "img-src http://localhost:3000 'self' blob: data:;" +
  "object-src 'none';" +
  "script-src https: cdn.jsdelivr.net cdnjs.cloudflare.com api.mapbox.com 'self' blob: ;" +
  "script-src-attr 'none';" +
  "style-src 'self' https: 'unsafe-inline';" +
  "upgrade-insecure-requests;" +
  "frame-src 'self' https://*.mapbox.com https://js.stripe.com/";



const router = express.Router()

router.use((req, res, next) => {
    res.setHeader(CSP, POLICY);
    next();
  });

router.get("/",bookingController.createBookingCheckout,authController.isLoggedIn,viewsController.getOverview)
router.get("/tour/:name",authController.isLoggedIn,authController.protect,bookingController.createCheckPayment,viewsController.getTour)
router.get("/login",authController.isLoggedIn,viewsController.getLoginFrom)
router.get("/signup",authController.isLoggedIn,viewsController.getSignupForm)
router.get("/me",authController.protect,viewsController.getAccount)
router.get("/my-tours",authController.protect,viewsController.getMyTour)
router.get("/my-review",authController.protect,viewsController.getReviews)
router.get("/my-bill",authController.protect,viewsController.getBills)
router.get('/review/:id',authController.protect,authController.isLoggedIn,viewsController.getReviewForm)
 
router.post("/submit-user-data",authController.protect,viewsController.updateUserData)

module.exports = router
 
