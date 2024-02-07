const path = require("path")
const express = require('express');
const morgan = require('morgan');
const { default: rateLimit } = require('express-rate-limit');
const { default: helmet } = require('helmet');
const ExpressMongoSanitize = require('express-mongo-sanitize')
const xss = require("xss-clean")
const hpp = require('hpp');
const compression = require("compression")
const app = express();
const tourRouter = require('./routes/tourRoutes'); 
const userRouter = require('./routes/userRoutes');
const reviewRouter = require("./routes/reviewRoutes")
const viewRouter = require("./routes/viewRoutes")
const bookingRouter = require("./routes/bookingRoutes")
const AppError = require("./utils/AppError")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const globalErrorHandle = require("./controller/errorController");

app.set('view engine','pug')
app.set('views',path.join(__dirname,'views')) 

const limiter = rateLimit({
  limit:1055,
  windowMs: 15 * 60 * 1000,
  message:"To many request from this ip, please try again in an hours"

}) 

app.use(cors())

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({extended:true,limit:"10kb"}))
app.use(cookieParser())

app.use(limiter)


app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

// Data sanitization against NoSQL query injection
app.use(ExpressMongoSanitize())

app.use(xss())

app.use(hpp({
  whitelist:[
    "duration",
    "maxGroupSize",
    "ratingsAverage",
    "ratingsQuantity",
    "price",
    "difficulty"
  ] 
}))

app.use(compression())

app.use(express.static(path.join(__dirname,'public')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} 


app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies)
  
  next(); 
});




app.use("/",viewRouter)
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use("/api/v1/bookings",bookingRouter)
 

app.all("*",(req,res,next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server.`,404))

})

app.use(globalErrorHandle)


module.exports = app;
