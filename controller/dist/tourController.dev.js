"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Tour = require('./../models/tourModel');

var APIFeatures = require('./../utils/apiFeatures');

var catchAsync = require('./../utils/catchAsync');

var AppError = require('./../utils/AppError');

var factory = require("./handlerFactory");

var sharp = require("sharp");

var multer = require("multer"); // exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(404).json({
//       status: 'Not found',
//       message: 'Invalid name or price',
//     });
//   }
//   next();
// };


var multerStorage = multer.memoryStorage();

var multerFilter = function multerFilter(req, file, cb) {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

var upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});
exports.uploadTourImage = upload.fields([{
  name: 'imageCover',
  maxCount: 1
}, {
  name: 'images',
  maxCount: 3
}]); // upload.single('image')
// upload.array('images',5)

exports.resizeTourImage = function _callee2(req, res, next) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(!req.files.imageCover || !req.files.images)) {
            _context2.next = 2;
            break;
          }

          return _context2.abrupt("return", next());

        case 2:
          req.body.imageCover = "tour-".concat(req.params.id, "-").concat(Date.now(), "-cover.jpeg");
          _context2.next = 5;
          return regeneratorRuntime.awrap(sharp(req.files.imageCover[0].buffer).resize(2000, 1333).toFormat("jpeg").jpeg({
            quality: 90
          }).toFile("public/img/tours/".concat(req.body.imageCover)));

        case 5:
          req.body.images = [];
          _context2.next = 8;
          return regeneratorRuntime.awrap(Promise.all(req.files.images.map(function _callee(file, index) {
            var fileName;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    fileName = "tour-".concat(req.params.id, "-").concat(Date.now(), "-").concat(index + 1, ".jpeg");
                    _context.next = 3;
                    return regeneratorRuntime.awrap(sharp(file.buffer).resize(2000, 1333).toFormat("jpeg").jpeg({
                      quality: 90
                    }).toFile("public/img/tours/".concat(fileName)));

                  case 3:
                    req.body.images.push(fileName);

                  case 4:
                  case "end":
                    return _context.stop();
                }
              }
            });
          })));

        case 8:
          next();

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.aliasTopTors = function _callee3(req, res, next) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          req.query.limit = '5';
          req.query.sort = '-ratingsAverage,price';
          req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
          next();

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, "reviews");
exports.createTour = factory.createOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.updateTour = factory.updateOne(Tour);

exports.getTourStats = function _callee4(req, res) {
  var stats;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Tour.aggregate([{
            $match: {
              ratingsAverage: {
                $gte: 4.5
              }
            }
          }, {
            $group: {
              _id: {
                $toUpper: '$difficulty'
              },
              numTours: {
                $sum: 1
              },
              numRatings: {
                $sum: '$ratingsQuantity'
              },
              avgRating: {
                $avg: '$ratingsAverage'
              },
              avgPrice: {
                $avg: '$price'
              },
              minPrice: {
                $min: '$price'
              },
              maxPrice: {
                $max: '$price'
              }
            }
          }, {
            $sort: {
              avgPrice: 1
            }
          }]));

        case 3:
          stats = _context4.sent;
          res.status(200).json({
            status: 'success',
            data: stats
          });
          _context4.next = 10;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          res.status(404).json({
            status: 'fail',
            message: _context4.t0
          });

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getMonthlyPlan = function _callee5(req, res) {
  var year, plan;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          year = req.params.year;
          _context5.next = 4;
          return regeneratorRuntime.awrap(Tour.aggregate([{
            $unwind: '$startDates'
          }, {
            $match: {
              startDates: {
                $gte: new Date("".concat(year, "-01-01")),
                $lte: new Date("".concat(year, "-12-31"))
              }
            }
          }, {
            $group: {
              _id: {
                $month: '$startDates'
              },
              numTorusStart: {
                $sum: 1
              },
              tours: {
                $push: '$name'
              }
            }
          }, {
            $addFields: {
              month: '$_id'
            }
          }, {
            $project: {
              _id: 0
            }
          }, {
            $sort: {
              numTorusStart: -1
            }
          }, {
            $limit: 12
          }]));

        case 4:
          plan = _context5.sent;
          res.status(200).json({
            status: 'success',
            data: {
              plan: plan
            }
          });
          _context5.next = 11;
          break;

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](0);
          res.status(404).json({
            status: 'fail',
            message: _context5.t0
          });

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 8]]);
}; // "/tours-within/:distance/center/:latlng/unit/:unit"


exports.getToursWithin = catchAsync(function _callee6(req, res, next) {
  var _req$params, distance, latlng, unit, _latlng$split, _latlng$split2, lat, lng, radius, tours;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _req$params = req.params, distance = _req$params.distance, latlng = _req$params.latlng, unit = _req$params.unit;
          _latlng$split = latlng.split(','), _latlng$split2 = _slicedToArray(_latlng$split, 2), lat = _latlng$split2[0], lng = _latlng$split2[1];
          radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

          if (!lat || !lng) {
            next(new AppError('Please provide latitutr and longitude in the format lat,lng.', 400));
          }

          _context6.next = 6;
          return regeneratorRuntime.awrap(Tour.find({
            startLocation: {
              $geoWithin: {
                $centerSphere: [[lng, lat], radius]
              }
            }
          }));

        case 6:
          tours = _context6.sent;
          res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
              data: tours
            }
          });

        case 8:
        case "end":
          return _context6.stop();
      }
    }
  });
});
exports.getDistances = catchAsync(function _callee7(req, res, next) {
  var _req$params2, latlng, unit, _latlng$split3, _latlng$split4, lat, lng, multiplier, distance;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$params2 = req.params, latlng = _req$params2.latlng, unit = _req$params2.unit;
          _latlng$split3 = latlng.split(','), _latlng$split4 = _slicedToArray(_latlng$split3, 2), lat = _latlng$split4[0], lng = _latlng$split4[1];
          multiplier = unit === "mi" ? 0.000621371 : 0.001;

          if (!lat || !lng) {
            next(new AppError('Please provide latitutr and longitude in the format lat,lng.', 400));
          }

          _context7.next = 6;
          return regeneratorRuntime.awrap(Tour.aggregate([{
            $geoNear: {
              near: {
                type: 'Point',
                coordinates: [lng * 1, lat * 1]
              },
              distanceField: 'distance',
              distanceMultiplier: multiplier
            }
          }, {
            $project: {
              distance: 1,
              name: 1
            }
          }]));

        case 6:
          distance = _context7.sent;
          res.status(200).json({
            status: "success",
            data: {
              distance: distance
            }
          });

        case 8:
        case "end":
          return _context7.stop();
      }
    }
  });
});