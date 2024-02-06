const AppError = require('./../utils/AppError');

const handleErrorDB = (err) => {
  console.log(err);
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 404);
};

const sentErrorDev = (err, req,res) => {
  if (req.originalUrl.startsWith("/api")){
    return res.status(err.statusCode).json({
      status:err.status,
      error:err,
      message:err.message,
      stack:err.stack
    })
  } else {
    res.status(err.statusCode).render("error",{
      title:"Something went wrong!",
      msg:err.message
    })
  } 
 
};

const sentErrorProduction = (err, req,res) => {
  if(req.originalUrl.startsWith("/api")){
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
  } else {
    if(err.isOperational){
      return res.status(err.statusCode).render("error",{
        title:"Something went wrong!",
        msg:err.message
      })
    } else {
      return res.status(err.statusCode).render("error",{
        title:"Something went wrong!",
        msg:"Please try again later."
      })
    }
    
  }
};

const handleDuplicateFields = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: /{${value}}/ Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const error = Object.values(err.errors).map((el) => el.message);
  const message = `invalid input data ${error.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError("Invalid token please log in again!",401)
}

const handleExpiredError = () => {
  return new AppError("Your token has expired. please log in again!",401)
}

module.exports = (err, req, res, next) => { 
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';

  if (process.env.NODE_ENV === 'development') {
    sentErrorDev(err, req,res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFields(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === "JsonWebTokenError") error = handleJWTError(error)
    if (err.name === "TokenExpiredError") error = handleExpiredError(error);
    
    sentErrorProduction(err, req,res); 
  }
};
