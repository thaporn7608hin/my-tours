const crypto = require("crypto")
const {promisify} = require("util")
const User = require("./../models/userModel")
const catchAsync = require("./../utils/catchAsync")
const jwt = require("jsonwebtoken")
const AppError = require("./../utils/AppError")
const Email = require("../utils/email")

const signToken = id => {
    const token = jwt.sign({id},process.env.JSON_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    })

    return token
}

const createSentToken = (user,statusCode,res) => {
    const token = signToken(user.id)

    const cookieiOption = {
        expires:new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly:true
    }

    if (process.env.NODE_ENV === "production") cookieiOption.secure = true

    res.cookie('jwt',token,cookieiOption)

    user.password = undefined

    res.status(statusCode).json({
        status:"success",
        token,
        data:{
            user
        }
    })
}

exports.singup = catchAsync(async (req,res,next) => {
    const newUser = await User.create(req.body)
    const url = `${req.protocol}://${req.get("host")}/me`
    await new Email(newUser,url).sendWelcome()
    createSentToken(newUser,200,res)
})
exports.login = catchAsync(async (req,res,next) => {
    const {email,password} = req.body
 

   // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
//   console.log("Crypto",await user.createPasswordResetToken("game"))
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }


    createSentToken(user,200,res)
})

exports.logout = (req,res,next) => {
    console.log("LOGOUT")
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
      });
      res.status(200).json({ status: 'success' });
    
}


exports.isLoggedIn = (async (req,res,next) => {
    if (req.cookies.jwt){
       try {
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JSON_SECRET)

        const currentUser = await User.findById(decoded.id)

        if (!currentUser){
            return next()
        }

        if (currentUser.changedPasswordAfter(decoded.iat)){
            return next()
        }
        res.locals.user = currentUser
        return next()
       } catch (error) {
        return next()
       }
    }

    next()
})


exports.protect = catchAsync(async (req,res,next) => {

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies.jwt){
        token = req.cookies.jwt
    }

    if (!token){
        return next(new AppError("You are not logged in! please log in to get access.",401))
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JSON_SECRET);
    
    const freshUser = await User.findById(decoded.id)

    if (!freshUser){
       return next(new AppError("The user belonging to this token does no longer exist.",404))
    }
    
    if (freshUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError("user recently changed password! please log in again."),401)
    }

    req.user = freshUser
    res.locals.user = freshUser
    next()  
}) 

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
      // roles ['admin', 'lead-guide']. role='user'
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError('You do not have permission to perform this action', 403)
        );
      }
        

      next();
    };
  };

exports.forgotPassword = catchAsync(async (req,res,next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user){
        return next(new AppError("There is no user with email address.",404))
    }

    const resetToken = await  user.createPasswordResetToken()
    await user.save({validateBeforeSave:false})

    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`
    const message = `Forgot your passwor? Submit a PATCH request with your new password and passwordConfirm to:${resetUrl}.\n if you did't forget your password and
    password, please ignore this email:`;

    await new Email(user,resetUrl).sentPasswordReset()


    res.status(200).json({
        status:"success",
        message:"token sent to email"
    })
})

exports.resetPassword = catchAsync(async (req,res,next) => {
    const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');


    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpired: { $gt: Date.now() }
      });

    if (!user){
        return next(new AppError("Token is invalid or hash expired",400))
    }

    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpired = undefined
    await user.save()

    createSentToken(user,200,res)

})

exports.updatePassword = catchAsync(async(req,res,next) => {
    const user = await User.findById(req.user.id).select("+password")
   
    if ( !(await user.correctPassword(req.body.passwordCurrent,user.password))){
        return next(new AppError("Your current password is wrong.",401))
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save()

    const token = signToken(user.id) 

    res.status(200).json({
        status:"success",
        token
    })

})