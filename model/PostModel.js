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


postSchema.pre(/^find/, function(next){
    postSchema.virtual("viewCount").get(function (){
        const post = this;
        return post.numView.length
    })

    //likes
    postSchema.virtual("likeCount").get(function(){
        const post = this;
        return post.likes.length
    })

    //dislike
    postSchema.virtual("dislikeCount").get(function(){
        const post = this;
        return post.dislikes.length
    })

    //like percentage
    postSchema.virtual("likepercentage").get(function(){
        const post = this;
        const total = +post.likes.length + +post.dislikes.length;
        const percentage = (post.likes.length / total) * 100;
        return post.likes.length === 0 && post.dislikes.length === 0
        ? "0%"
        : `${percentage}`
    })

    //like percentage
    postSchema.virtual("dislikepercentage").get(function(){
        const post = this;
        const total = +post.likes.length + +post.dislikes.length;
        const percentage = (post.dislikes.length / total) * 100;
        return post.likes.length === 0 && post.dislikes.length === 0
        ? "0%"
        : `${percentage}`
    })

    //days ago
    postSchema.virtual("daysAgo").get(function(){
        const post = this;
        const postDate = new Date(post.createdAt)

        //get current date
        const currentDate = new Date();

        //get difference in milliseconds
        const timeDifference = currentDate.getTime() - postDate.getTime()


        //convert to milliseconds
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const years = Math.floor(days / 365);

        let output;
        if(years > 0){
            output = `${years} year${years > 1 ? "s" : ""} ago`;
        }else if(days > 0){
            output = `${days} day${days > 1 ? "s" : ""} ago`;
        }else if(hours > 0){
            output = `${hours} hour${hours > 1 ? "s" : ""} ago`;
        }else if (minutes > 0){
            output = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
        }else{
            output = `${seconds} second${seconds > 1 ? "s" : ""} ago`;
        }
        return output;
    })


    next()
})

const Post = mongoose.model("Post",postSchema);

export default Post;