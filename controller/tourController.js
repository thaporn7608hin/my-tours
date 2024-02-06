const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
const factory = require("./handlerFactory")
const sharp = require("sharp")
const multer = require("multer")
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(404).json({
//       status: 'Not found',
//       message: 'Invalid name or price',
//     });
//   }
//   next();
// };


const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
    storage:multerStorage,
    fileFilter:multerFilter
})

exports.uploadTourImage = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

// upload.single('image')
// upload.array('images',5)

exports.resizeTourImage = async (req,res,next) => {

  if(!req.files.imageCover || !req.files.images) return next()
  
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`

  await sharp(req.files.imageCover[0].buffer)
    .resize(2000,1333)
    .toFormat("jpeg")
    .jpeg({quality:90})
    .toFile(`public/img/tours/${req.body.imageCover}`)


  req.body.images = []
  
  await Promise.all(
    req.files.images.map(async(file,index) => {
      const fileName = `tour-${req.params.id}-${Date.now()}-${index+1}.jpeg`
      await sharp(file.buffer)
        .resize(2000,1333)
        .toFormat("jpeg")
        .jpeg({quality:90})
        .toFile(`public/img/tours/${fileName}`)
      
      req.body.images.push(fileName)
    })
  )
  
  next()
}

exports.aliasTopTors = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = factory.getAll(Tour)
exports.getTour = factory.getOne(Tour,"reviews")
exports.createTour = factory.createOne(Tour)
exports.deleteTour = factory.deleteOne(Tour)


exports.updateTour = factory.updateOne(Tour)

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { 
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year;

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTorusStart: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: { _id: 0 },
      },
      {
        $sort: { numTorusStart: -1 },
      },
      {
        $limit: 12,
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};
// "/tours-within/:distance/center/:latlng/unit/:unit"
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});

exports.getDistances = catchAsync(async(req,res,next)=> {
  const {latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === "mi" ? 0.000621371 : 0.001

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const distance = await Tour.aggregate([
    {
      $geoNear:{
        near: {
          type:'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField:'distance',
        distanceMultiplier:multiplier
      }
    },
    {
      $project:{
        distance:1,
        name:1
      }
    }
  ])

  res.status(200).json({
    status:"success",
    data:{
      distance
    }
  })
})
