module.exports = fn =>{
    return (req,res,nextError) => {
      fn(req,res,nextError).catch(nextError)
    
    }
}