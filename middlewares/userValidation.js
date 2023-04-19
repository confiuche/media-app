import joi from 'joi'
import User from '../model/userModel.js'

export const validateUser = async(req,res,next)=>{
const Schema = joi.object({
    firstname:joi.string().min(2).required(),
    lastname:joi.string().min(2).required(),
    email:joi.string().email(),
    password:joi.string().min(3)
})
const validateResult = Schema.validate(req.body);

if(validateResult.error){
    return res.status(400).json(validateResult.error.message)
}
next();
}