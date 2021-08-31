const jwt = require ('jsonwebtoken')
const User = require('../models/user.js')

const auth = async (req,res,next)=>{
try{
    const token = req.header('Authorization').replace('Bearer ','')
    console.log(token)
    // console.log('tessst')
    const decode = jwt.verify(token, 'Todo-Manger')
    console.log(decode)
    // console.log('testtt')
    const user = await User.findOne({_id:decode._id,'tokens.token':token})
    console.log(user)
    if (!user){
        console.log('No Users Is Found')
        throw new Error()
    }
    req.user = user
    req.token = token
    next()
}
catch(e){
    res.status(401).send({error:'Please authenticate'})
}
}

module.exports = auth 