const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
// name email photo
const userSshema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"]
  },
  email: {
    type: String,
    required: [true, "Please provide your email!"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"]
  },
  photo:{
    type:String,
    default:"default.jpg"
  },
  role:{
    type:String,
    enum:["user","guide","lead-guide","admin"],
    default:"user"
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please your confirm password"],
    validate: {
      validator: function (passConfirm) {
        return passConfirm === this.password
      },
      message: "password are not same!"
    }
  },
  "passwordChangeAt": Date,
  "passwordResetToken":String,
  "passwordResetExpired":String,
  active:{
    type:Boolean,
    default:true,
    select:false
  }



})

userSshema.pre(/^find/,function(next){
  this.find({active:{$ne:false}})
  next()
})

userSshema.pre('save', async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined
  next()
})

userSshema.pre("save",function(next){
  if (!this.isModified("password") || this.isNew){
    return next()
  }

  this.passwordChangeAt = Date.now() - 1000
  next()
})

userSshema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSshema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changedTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSshema.methods.createPasswordResetToken = function(){
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');



  this.passwordResetExpired = Date.now() + 10 * 60 * 1000;

  return resetToken;

}

const User = mongoose.model("users", userSshema)

module.exports = User