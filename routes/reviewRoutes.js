const express = require("express")
const reviewController = require("./../controller/reviewController")
const authController = require("./../controller/authController")

const router = express.Router({mergeParams:true})

router.use(authController.protect)

router
    .route('/')
    .get(reviewController.getAllReview)

router
    .route("/:id")
    .get(reviewController.getReview)
    .delete(authController.restrictTo("user","admin"),reviewController.deleteReview)
    .patch(authController.restrictTo("user","admin"),reviewController.setTourUserId,reviewController.updateReview)
    .post(authController.restrictTo("user","admin"),reviewController.setTourUserId,reviewController.createReview)

    
module.exports = router