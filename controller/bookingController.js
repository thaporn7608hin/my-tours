require("dotenv").config()
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
const factory = require("./handlerFactory");
const Tour = require('../models/tourModel');
const Booking = require('../models/bookModel');
const stripe = require("stripe")(process.env.API_KEY)
exports.getCheckoutSession = catchAsync( async (req,res,next) => {
    const tour = await Tour.findById(req.params.tourId)
    const session = await stripe.checkout.sessions.create({
        line_items:[
            {  
                price_data:{
                    currency: 'thb',
                    unit_amount: tour.price * 100,
                    product_data: { 
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
                      },
                },
                quantity:1 

            }  
        ] ,
        payment_method_types:['card'],
        mode:'payment', 
        success_url:`${req.protocol}://${req.get("host")}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url:`${req.protocol}://${req.get("host")}/tour/${tour.name}`,
        customer_email:req.user.email,
        client_reference_id:req.params.tourId,
        
    })
 
    res.status(200).json({
        status: 'success',
        session
      });
})

exports.createBookingCheckout = async(req,res,next) => {
    let {tour,user,price} = req.query

    if(!tour && !user && !price) return next()
    
    await Booking.create({tour,user,price})
    res.redirect(req.originalUrl.split("?")[0])
} 

exports.getAllBook = factory.getAll(Booking)
exports.getBook = factory.getOne(Booking)
exports.createBook = factory.createOne(Booking)
exports.updateBook = factory.updateOne(Booking)
exports.deleteBook = factory.deleteOne(Booking)