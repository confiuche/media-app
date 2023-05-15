import mongoose from "mongoose";
import Post from "../model/PostModel.js";
import User from "../model/userModel.js";
import Comment from "../model/Comment.js";


export const createComment = async(req,res) => {
    const {description} = req.body;
    try {
        //find the post you want to comment
        const post = await Post.findById(req.params.id)

        //get the user that logged in
        const loggedUser = req.userAuth

        //create the comment
        const comment = await Comment.create({
            post: post._id,
            description,
            user: loggedUser,
        })

        //push the comment to the post
        post.comments.push(comment._id)

        //push the comment to the user
        const user = await User.findById(loggedUser)
        user.comments.push(comment._id)

        //save
        await post.save()
        await user.save()

        res.json({
            status:"success",
            data: comment
        })
    } catch (error) {
        res.json(error.message)
    }
}



//update comment
export const updateCommentCtr = async (req, res) => {
    const {description} = req.body
    try {
        //get the post you want to update
        const comment = await Comment.findById(req.params.id)

        if(!comment){
            return res.json({
                status:"success",
                message:"comment not found"
            })
        }

        //check if comment belong to current user
        if(comment.user.toString() !== req.userAuth.toString()){
            return res.json({
                status:"success",
                message:"You are not authorized to update this comment"
            })
        }

        const commentUpdate = await Comment.findByIdAndUpdate(req.params.id,{
            description
        },{new:true, runValidators:true}
        )
          
        res.json({
            status:"success",
            data:commentUpdate
        })
    } catch (error) {
        res.json(error.message)
    }
}



//delete comment
export const deleteCommentCtr = async(req,res) => {
    try{
        //find the comment
        const comment = await Comment.findById(req.params.id);

        //check if the comment belong to the current user
        if(comment.user.toString() !== req.userAuth.toString()){
            return res.json({
                status:"error",
                message:"You are not authorized to delete this comment"
            })
        }

        //delete comment
        await Comment.findByIdAndDelete(req.params.id)
        res.json({
            status:"success",
            data:"Comment deleted successfully"
        })
        
    }catch(error){
        res.json(error.message)
    }
}