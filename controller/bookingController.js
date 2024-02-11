require("dotenv").config()
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
const factory = require("./handlerFactory");
const Tour = require('../models/tourModel');
const Booking = require('../models/bookModel');
const Bill = require("../models/billModel");
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
        cancel_url:`${req.protocol}://${req.get("host")}/tour/${tour.name}?tour=${req.params.tourId}`, 
        customer_email:req.user.email, 
        client_reference_id:req.params.tourId,
         
    })
 
    res.status(200).json({
        status: 'success',
        session
      });
})

exports.createBookingCheckout = async (req, res, next) => {
    let { tour, user, price } = req.query;

    if (!tour && !user && !price) return next();

    try {
        await Booking.create({ tour, user, price });

        const bills = await Bill.find();
        let IdBill
        for (const bill of bills) {
            if (bill.tour.toString() === tour && bill.user.toString() === user) {
            IdBill = bill.id
        }}
        if(IdBill){
            await Bill.findByIdAndUpdate(IdBill, { paid: true }, {
                new: true,
                runValidators: true
            });
        } else {
            await Bill.create({tour,user,paid:true})
        }

    } catch (error) {
        console.error(error);
        return next(error);
    }

    res.redirect(req.originalUrl.split("?")[0]);
};


exports.createCheckPayment = async(req,res,next) => {
   try {
    let {tour} = req.query
    
    if(!tour) return next()
    

    console.log("Tour_id = ",tour)
    console.log("req_user = ",req.user._id.toString())
    
    const body = {
        tour:tour,
        user:req.user._id.toString(),
        paid:false
    }

    const checkBill = (await Bill.find()).some(el => {
        if(el.tour.toString() === tour && el.user.toString() === req.user._id.toString()){
            return true
        } 
    })

   if(checkBill) throw "error"
    
    await Bill.create(body)
    res.redirect(req.originalUrl.split("?")[0])
   } catch (error) {
    console.log(error)
    console.log(error)
    res.redirect(req.originalUrl.split("?")[0])
   } 

}

exports.getAllBook = factory.getAll(Booking) 
exports.getBook = factory.getOne(Booking)
exports.createBook = factory.createOne(Booking) 
exports.updateBook = factory.updateOne(Booking) 
exports.deleteBook = factory.deleteOne(Booking)