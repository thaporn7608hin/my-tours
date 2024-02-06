const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  deleteTour,
  updateTour,
  aliasTopTors,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  uploadTourImage, 
  resizeTourImage
} = require('../controller/tourController');
const { protect, restrictTo } = require('../controller/authController');
const reviewController = require("./../controller/reviewController")
const reviewRoutes = require("./../routes/reviewRoutes")


const router = express.Router();

router.use("/:id/reviews",reviewRoutes)

// router.param("id",checkId)
router.route('/monthly-plan/:year').get(getMonthlyPlan)
router.route('/tour-stats').get(getTourStats)
router.route("/top-5-cheap").get(aliasTopTors,getAllTours) 

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(getToursWithin)

router
  .route("/distances/:latlng/unit/:unit")
  .get(getDistances)


router
  .route('/')
  .get(getAllTours)
  .post(protect,restrictTo("admin","lead-guide"),createTour);


router.route('/:id')
  .get(getTour)
  .delete(protect,restrictTo('admin','lead-guide'),deleteTour)
  .patch(protect,restrictTo("admin","lead-guide"),uploadTourImage,resizeTourImage,updateTour); 

// router
//     .route("/:id/reviews")
//     .post(
//       protect,
//       restrictTo("user"),
//       reviewController.createReview,
      
//     )
  


module.exports = router
