const catchAsync = require("../utils/catchAsync")
const Review = require("./../models/reviewModel")
const factory = require("./handlerFactory")

exports.getAllReview = factory.getAll(Review)

exports.setTourUserId = catchAsync(async (req,res,next) => {
    if (!req.body.tour) req.body.tour = req.params.id
    if (!req.body.user) req.body.user = req.user.id
    next()
})

exports.getReview = factory.getOne(Review)
exports.createReview = factory.createOne(Review)
exports.updateReview = factory.updateOne(Review)
exports.deleteReview = factory.deleteOne(Review)