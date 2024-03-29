const mongoose = require("mongoose")
const Tour = require("./tourModel")
const reviewSchema = new mongoose.Schema(
    {
        review:{
            type:String,
            required:[true,"Review can't be emty!"]
        },
        rating:{
            type:Number,
            min:1,
            max:5
        },
        createAt:{
            type:Date,
            default:Date.now
        },
        tour:{
            type:mongoose.Schema.ObjectId,
            ref:"tour",
            required:[true,"Review must belong to a tour."],
        },
        user:{
            type:mongoose.Schema.ObjectId,
            ref: "users",
            required:[true,"Review must belong to a user."]
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

reviewSchema.statics.calAverageRatings = async function(tourId){
    const stats = await this.aggregate([
        {
            $match:{tour:tourId}
        },
        {
            $group:{
                _id:"$tour",
                nRating:{$sum:1},
                avgRating:{$avg:'$rating'}
            }
        }
    ])
    console.log(stats)

    if (await Tour.findById(tourId)){
        if (stats.length > 0){
            await Tour.findByIdAndUpdate(tourId,{
                ratingsAverage:stats[0].avgRating,
                ratingsQuantity:stats[0].nRating
            })
        } else {
            await Tour.findByIdAndUpdate(tourId,{
                ratingsAverage:4.5,
                ratingsQuantity:0
            })
        }
    }
}

reviewSchema.index({tour:1,user:1},{unique:true})

reviewSchema.post("save",function(){
    this.constructor.calAverageRatings(this.tour)
})

reviewSchema.pre(/^find/,function(next){
    this.populate({
        path:"user",
        select:"name photo"
    })
    
   
    next()
})
reviewSchema.pre(/^find/,function(next){
    this.populate({
        path:'tour',
        select:'name id imageCover',
    })
    
   
    next()
})



reviewSchema.post(/^findOneAnd/,async function(doc){
    this.model.calAverageRatings(doc.tour)
})

const Review = mongoose.model("Review",reviewSchema)
module.exports = Review  