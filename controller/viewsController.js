const Tour = require('../models/tourModel')
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/AppError")
const User = require('../models/userModel')
const Booking = require('../models/bookModel')
const Review = require('../models/reviewModel')
const Bill = require('../models/billModel')

exports.getOverview = catchAsync(async (req,res) => {

    const tours = await Tour.find()
    const date = tours[0].startDates[0].toLocaleString('en-us', {month: 'long', year: 'numeric'})
    res.status(200).render('overview',{
      title:"All Tours",
      tours:tours
    }) 
  })

exports.getTour =catchAsync( async (req,res) => {
    const tour = await Tour.findOne({name:req.params.name}).populate({
      path: 'reviews',
      fields: 'review rating user'
    })
    const booking = await Booking.find({user:res.locals.user._id})
    // const bookId = booking.map(el => el.tour)
    // console.log(bookId)
    // const toursBook = await Booking.find({tour:bookId,user:res.locals.user._id})
    let tourId='';
    for (let index = 0; index < booking.length; index++) {
      if (booking[index].tour.toString() === tour.id){
        tourId = tour.id
      }
      
    }

    if (!tour) {
      return next(new AppError('There is no tour with that name.', 404));
    }
    res.status(200).render('tour',{
      title:`${tour.name} tour`,
      tourId,
      tour
    })
     
  })

exports.getLoginFrom = catchAsync(async (req,res,next) => {
  res.status(200).render('login',{
    title:'Login into your account'
  })
})

exports.getSignupForm = catchAsync(async (req,res,next) => {
  res.status(200).render('signup',{
    title:'Login into your account'
  })
})

exports.getReviewForm = catchAsync(async (req,res,next) => {
  res.status(200).render('reviews',{
    title:'Login into your account',
    tourId:req.params.id
  })
})

exports.getAccount = catchAsync(async (req,res,next) => {
  res.status(200).render("account",{
    title:"Your account"
  })
})

exports.getBills = catchAsync(async(req,res,next) => {
  const bills = await Bill.find({user:req.user.id})
  console.log("bill => ",bills)
  res.status(200).render("bills",{
    bills
  })
  
})


exports.updateUserData = catchAsync(async(req,res,next) => {
    const updateUser = await User.findByIdAndUpdate(req.user.id,{
      name:req.body.name,
      email:req.body.email
    },
    {
      new:true,
      runValidators:true
    })
  
    res.status(200).render("account",{
      title:"Your account",
      user:updateUser
    })

})

exports.getMyTour = catchAsync(async(req,res,next) => {
  const booking = await Booking.find({user:req.user.id})
  const tourID = booking.map(el => el.tour)
  const tours = await Tour.find({_id:{$in:tourID}})

  const isPayment = booking.map(el => el.paid)

  res.status(200).render("myTours",{
    title:"My Tours",
    tours,
  }) 
  
})

exports.getReviews = catchAsync(async(req,res,next)=> {
  const review = await Review.find({user:{$in:req.user.id}})
  console.log("my-review = ",review)
  res.status(200).render("reviewAcc",{
    title:"Your reviews",
    review
  })
})