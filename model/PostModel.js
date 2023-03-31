import mongoose,{Schema} from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title:{
        type:String,
        required:[true,"Title of the post is required"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Description of the post is required"],
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:[true,"Category of the [post is required"],
    },
    numView:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    ],
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    ],
    dislikes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    ],
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment",
        },
    ],
    user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:[true,"please author is required"],
    },
    photo:{
        type:String,
    },
},
{
    timestamps:true,
    toJSON:{virtuals:true}
}
);
const Post = mongoose.model("Post",postSchema);

export default Post;