const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:"tour",
        required:[true,"Review must belong to a tour."],
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref: "users",
        required:[true,"Review must belong to a user."]
    },
      paid: {
        type:Boolean,
        required: [true, 'Booking must belong to a User!']
      }
})

bookSchema.pre(/^find/,function(next){
    this.populate({
        path:"user",
        select:"name photo"
    })
    
   
    next()
})
bookSchema.pre(/^find/,function(next){
    this.populate({
        path:'tour',
        select:'name imageCover',
    })
     
   
    next()
})
  
const Bill = mongoose.model('Bill', bookSchema);
  
module.exports = Bill
