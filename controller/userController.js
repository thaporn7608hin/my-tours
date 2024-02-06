const User = require("./../models/userModel")
const catchAsync = require("./../utils/catchAsync")
const AppError = require("./../utils/AppError")
const factory = require("./handlerFactory")
const sharp = require("sharp")
const multer = require("multer")

const multerStorage = multer.memoryStorage()

const multerFilter = (req,file,cb) => {
    if(file.mimetype.startsWith("image")){
        cb(null,true)
    } else {
        cb(new AppError("Not an image! please upload only images.",400),false)
    }
}

const upload = multer({
    storage:multerStorage,
    fileFilter:multerFilter
})

exports.uploadPhoto = upload.single("photo")

exports.resizePhoto = async (req,res,next) => {
    if(!req.file) return next()

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`

    await sharp(req.file.buffer)
        .resize(500,500)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`public/img/users/${req.file.filename}`)
    
    
    
    next()
}

const filterObj = (obj,...allowedFields) => {
    let newObj = {}
    Object.keys(obj).forEach(el => { 
        if (allowedFields.includes(el)){
            newObj[el] = obj[el]
        }
    })
    return newObj

}

exports.getMe = (req,res,next)=> {
    req.params.id = req.user.id
    next()
}

exports.deleteMe = catchAsync(async (req,res,next) => {
    const user = await User.findByIdAndUpdate(req.user.id,{active:false})

    res.status(200).json({
        status:"success",
        user
    })

})
exports.updateMe = catchAsync(async(req,res,next) => {

    

    if (req.body.password || req.body.passwordConfirm){
        return next(new AppError("Please route is not update please use /updateUser",400))
    }

    const filterBody = filterObj(req.body,"name","email")
    if(req.file) filterBody.photo = req.file.filename
    const updateUser = await User.findByIdAndUpdate(req.user.id,filterBody,{
        new:true,
        runValidators:true
    })

    res.status(200).json({
        status:"success",
        data:{
            updateUser
        }
    })

})



exports.getUser = factory.getOne(User)
exports.getAllUser = factory.getAll(User)
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)