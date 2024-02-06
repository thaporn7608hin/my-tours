const Tour = require('../models/tourModel')
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/AppError")
const User = require('../models/userModel')
const Booking = require('../models/bookModel')


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

    if (!tour) {
      return next(new AppError('There is no tour with that name.', 404));
    }

    res.status(200).render('tour',{
      title:`${tour.name} tour`,
      tour
    })
    
  })

exports.getLoginFrom = catchAsync(async (req,res,next) => {
  res.status(200).render('login',{
    title:'Login into your account'
  })
})

exports.getAccount = catchAsync(async (req,res,next) => {
  res.status(200).render("account",{
    title:"Your account"
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

  res.status(200).render("overview",{
    title:"My Tours",
    tours
  })
  
})