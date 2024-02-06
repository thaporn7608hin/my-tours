"use strict";

var User = require("./../models/userModel");

var catchAsync = require("./../utils/catchAsync");

var AppError = require("./../utils/AppError");

var factory = require("./handlerFactory");

var sharp = require("sharp");

var multer = require("multer");

var multerStorage = multer.memoryStorage();

var multerFilter = function multerFilter(req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! please upload only images.", 400), false);
  }
};

var upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});
exports.uploadPhoto = upload.single("photo");

exports.resizePhoto = function _callee(req, res, next) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (req.file) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", next());

        case 2:
          req.file.filename = "user-".concat(req.user.id, "-").concat(Date.now(), ".jpeg");
          _context.next = 5;
          return regeneratorRuntime.awrap(sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({
            quality: 90
          }).toFile("public/img/users/".concat(req.file.filename)));

        case 5:
          next();

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
};

var filterObj = function filterObj(obj) {
  for (var _len = arguments.length, allowedFields = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    allowedFields[_key - 1] = arguments[_key];
  }

  var newObj = {};
  Object.keys(obj).forEach(function (el) {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getMe = function (req, res, next) {
  req.params.id = req.user.id;
  next();
};

exports.deleteMe = catchAsync(function _callee2(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, {
            active: false
          }));

        case 2:
          user = _context2.sent;
          res.status(200).json({
            status: "success",
            user: user
          });

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports.updateMe = catchAsync(function _callee3(req, res, next) {
  var filterBody, updateUser;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!(req.body.password || req.body.passwordConfirm)) {
            _context3.next = 2;
            break;
          }

          return _context3.abrupt("return", next(new AppError("Please route is not update please use /updateUser", 400)));

        case 2:
          filterBody = filterObj(req.body, "name", "email");
          if (req.file) filterBody.photo = req.file.filename;
          _context3.next = 6;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, filterBody, {
            "new": true,
            runValidators: true
          }));

        case 6:
          updateUser = _context3.sent;
          res.status(200).json({
            status: "success",
            data: {
              updateUser: updateUser
            }
          });

        case 8:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.getUser = factory.getOne(User);
exports.getAllUser = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);