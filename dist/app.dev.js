"use strict";

var path = require("path");

var express = require('express');

var morgan = require('morgan');

var _require = require('express-rate-limit'),
    rateLimit = _require["default"];

var _require2 = require('helmet'),
    helmet = _require2["default"];

var ExpressMongoSanitize = require('express-mongo-sanitize');

var xss = require("xss-clean");

var hpp = require('hpp');

var compression = require("compression");

var app = express();

var tourRouter = require('./routes/tourRoutes');

var userRouter = require('./routes/userRoutes');

var reviewRouter = require("./routes/reviewRoutes");

var viewRouter = require("./routes/viewRoutes");

var bookingRouter = require("./routes/bookingRoutes");

var AppError = require("./utils/AppError");

var cookieParser = require("cookie-parser");

var cors = require("cors");

var globalErrorHandle = require("./controller/errorController");

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
var limiter = rateLimit({
  limit: 1055,
  windowMs: 15 * 60 * 1000,
  message: "To many request from this ip, please try again in an hours"
});
app.use(cors());
app.use(express.json({
  limit: '10kb'
}));
app.use(express.urlencoded({
  extended: true,
  limit: "10kb"
}));
app.use(cookieParser());
app.use(limiter);
app.use(helmet.crossOriginResourcePolicy({
  policy: 'cross-origin'
})); // Data sanitization against NoSQL query injection

app.use(ExpressMongoSanitize());
app.use(xss());
app.use(hpp({
  whitelist: ["duration", "maxGroupSize", "ratingsAverage", "ratingsQuantity", "price", "difficulty"]
}));
app.use(compression());
app.use(express["static"](path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(function (req, res, next) {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});
app.use("/", viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use("/api/v1/bookings", bookingRouter);
app.all("*", function (req, res, next) {
  next(new AppError("Can't find ".concat(req.originalUrl, " on the server."), 404));
});
app.use(globalErrorHandle);
module.exports = app;