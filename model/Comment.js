import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        post:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post",
            required:[true,"Post is required"],
        },
        user:{
            type:Object,
            required:[true,"user is required"],
        },
        description:{
            type:String,
            required:[true,"comment description is required"],
        },
    },
    {
        timestamps:true
    }
);
const Comment = mongoose.model("Comment",commentSchema);
export default Comment;