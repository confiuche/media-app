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


//fetch a particular category
export const displaySingleCategory = async(req,res) =>{
    try {
        const foundCate = await Category.findById(req.params.id);
        if(!foundCate){
            return res.json({
                status:"error",
                message:"No such category"
            })
        }
        res.json({
            status:"success",
            data:foundCate
        })
    } catch (error) {
        res.json(error.message)
    }
}


//delete category
export const deleteCategory = async(req,res) => {
    try {
        const foundcate = await Category.findById(req.params.id)
        if(foundcate){
        const deleteCate = await Category.findOneAndDelete(req.params.id);
        res.json({
            status:"success",
            data:"category deleted successfully"
        })
    }else{
        return res.json({
            status:"error",
            message:"No such"
        })
    }
    } catch (error) {
        res.json(error.message)
    }
}


//update category
export const updateCategory = async(req,res)=>{
    try {
        const foundcategory = await Category.findById(req.params.id)
        if(!foundcategory){
            return res.json({
                status:"error",
                message:"record not found"
            })
        }
        //find record to update
        const foundcate = await Category.findByIdAndUpdate(req.params.id,{
            $set:{
                title:req.body.title
            }
        },{
            new:true
        })
        res.json({
            status:"success",
            data:"Category updated successfully"
        })
    } catch (error) {
        res.json(error.message)
    }
}