const catchAsync = require("../utils/catchAsync")
const Review = require("./../models/reviewModel")
const mongoose = require("mongoose")
const factory = require("./handlerFactory")

exports.getAllReview = factory.getAll(Review)

exports.setTourUserId = catchAsync(async (req,res,next) => {
    if (!req.body.tour) req.body.tour = req.params.id
    if (!req.body.user) req.body.user = req.user.id

    const review = await Review.find()
    const istour = review.some(el => {
        if (el.tour.id.toString() === req.body.tour && el.user.id.toString() === req.body.user){
            req.params.id = el.id
            console.log("elee => ",el)
            return true
        }
    });
   req.isTour = istour


   next()
})

exports.getReview = factory.getOne(Review) 
exports.createReview = factory.createOne(Review)
exports.updateReview = factory.updateOne(Review)
exports.deleteReview = factory.deleteOne(Review)