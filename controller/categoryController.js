import User from "../model/userModel.js";
import bcrypt from 'bcrypt';
import generateToken from "../utils/generateToken.js";
import { obtainTokenFromHeader } from "../utils/obtaintokenfromheader.js";
import Category from "../model/Category.js";



export const createCategory = async(req,res)=>{
        //only admin will create category
        const { title } = req.body;
    try {
        const isTitlExist = await Category.findOne({title});
        if(isTitlExist){
            return res.json({
                status:"error",
                message:"Title with this name already exists"
            })
        }

        const category = await Category.create({
            title,
            user:req.userAuth
        })

        res.json({
            status:"success",
            data:category
        })
    } catch (error) {
        res.json(error.message)
    }
}

//fetch all
export const list = async(req,res)=>{
    try {
        const categoryList = await Category.find({})
        res.json({
            status:"success",
            data:categoryList
        })
    } catch (error) {
        res.json(error.message)
    }
}