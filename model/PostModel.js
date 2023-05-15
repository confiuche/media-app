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
        required:[true,"Category of the post is required"],
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


//get likes count
postSchema.virtual("like").get(function(){
    return this.likes.length
})


//get dislikes count
postSchema.virtual("dislike").get(function(){
    return this.dislikes.length
})


//get view count
postSchema.virtual("viewcount").get(function(){
    return this.numView.length
})


const Post = mongoose.model("Post",postSchema);

export default Post;