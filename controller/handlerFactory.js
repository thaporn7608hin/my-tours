const AppError = require("../utils/AppError")
const catchAsync = require("../utils/catchAsync")
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = Model => catchAsync(async (req,res,next)=>{
    const doc = await Model.findByIdAndDelete(req.params.id)
  
    if (!doc){
      return next(new AppError("No tour found with that ID",404))
    }
  
    res.status(204).json({
      status:"success",
      data:null
    })
  }) 



exports.updateOne = Model => catchAsync(async (req,res,next)=> {
  const tour = await Model.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true
  })
  if (!tour){
    return next(new AppError('No tour found with that ID', 404))
  }

  res.status(200).json({
    status:"success",
    data:{
      tour
    }
  })
})

exports.createOne = Modle => catchAsync(async (req,res,next) => {
  if (req.isTour) {
    return res.status(200).json({
      status:"replete",
      data:null
    })
  }

  const doc = await Modle.create(req.body)
  console.log("body = ",req.body)
  res.status(200).json({
    status:"success",
    data:{
      doc:doc
    }
  })
})

exports.getOne = (Model,popOption) => catchAsync(async (req,res,next) => {
  let query = await Model.findById(req.params.id)

  if (popOption) query = query.populate({
    path:popOption,
    select:"-__v",
  })

  const doc = await query

  if (!doc) next(new AppError("No document found with that ID"))

  res.status(200).json({
    status:"get success",
    data:{
      data:doc
    }
  })


})

exports.getAll = Model =>  catchAsync(async (req, res, next) => {
  let filter = {}
  if(req.params.id) filter = {tour:req.params.id}
  const features = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query
  res.status(200).json({
    status: 'success get tours',
    result:tours.length,
    data:{
      data:tours
    }
  });
});