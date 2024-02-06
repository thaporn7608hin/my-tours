"use strict";

var mongoose = require('mongoose');

var slugify = require('slugify'); // const User = require('./userModel');
// const validator = require("validator")


var toursSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tours must have name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must have less or equal then 40 characters'],
    minlength: [10, 'A tour name must have more or equal then 10 characters'] // validate:{
    //   validator:function(name){
    //     return validator.isAlpha(name)
    //   },
    //   message:"Tour name must only contain character"
    // }

  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have duration'],
    trim: true
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have group size'],
    trim: true
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have difficulty'],
    trim: true,
    "enum": {
      values: ["easy", "medium", "difficult"],
      message: "Difficulty is either : easy medium difficulty"
    }
  },
  ratingsAverage: {
    type: Number,
    "default": 4.5,
    trim: true,
    min: [1, "Ratings must be above 1.0"],
    max: [5, "Ratings must be below 5.0"],
    set: function set(val) {
      return Math.round(val * 10) / 10;
    }
  },
  ratingsQuantity: {
    type: Number,
    "default": 0,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'A tours must have a price'],
    trim: true
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function validator(val) {
        return val < this.price;
      },
      message: "Discount price"
    }
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    "default": Date.now(),
    select: false
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    "default": false
  },
  startLocation: {
    type: {
      type: String,
      "default": "Point",
      "enum": ["Point"]
    },
    coordinates: [Number],
    address: String,
    description: String
  },
  locations: [{
    type: {
      type: String,
      "default": 'Point',
      "enum": ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String,
    day: Number
  }],
  guides: [{
    type: mongoose.Schema.ObjectId,
    ref: 'users' // อ้างโมเดลของ users

  }]
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});
toursSchema.index({
  price: 1,
  ratingsAverage: -1
});
toursSchema.index({
  slug: 1
});
toursSchema.index({
  startLocation: '2dsphere'
});
toursSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
toursSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id"
});
toursSchema.pre('save', function (next) {
  this.name = slugify(this.name, {
    lower: true
  }); // console.log(mongoose.FlatRecord.name) 

  next();
}); // toursSchema.pre("save",async function (next){
//   const guidesPromise = this.guides.map(async  id => await User.findById(id))
//   this.guides = await Promise.all(guidesPromise)
//   next()
// })

toursSchema.pre(/^find/, function (next) {
  this.find({
    secretTour: {
      $ne: true
    }
  });
  next();
});
toursSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt"
  });
  next();
}); // toursSchema.post(/^find/, function (next) {
//   console.log('find success');
//   next();
// }); 

toursSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: {
      secretTour: {
        $ne: true
      }
    }
  });
  next();
});
var Tour = mongoose.model('tour', toursSchema);
module.exports = Tour;