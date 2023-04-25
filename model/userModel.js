import mongoose,{ Schema } from "mongoose";

const userSchema = new mongoose.Schema({
        firstname:{
            type:String,
            required:[true, "First name is required"],
        },
        lastname:{
            type:String,
            required:[true, "Last name is required"],
        },
        profilephoto:{
            type:String,
        },
        email:{
            type:String,
            required:[true, "Email is required"],
        },
        password:{
            type:String,
            required:[true, "password is required"],
        },
        isBlocked:{
            type:Boolean,
            default:false,
        },
        isAdmin:{
            type:Boolean,
            default:false,
        },
        role:{
            type:String,
            enum:["Admin", "Editor", "Guest"],
            default:"Guest"
        },
        views:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
        followers: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            },
        ],
        following: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            }
        ],
        blocked: [
            {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
            }
        ],
        posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post"
        }
    ],
        comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ],
        award:{
            type:String,
            enum:["Bronze", "Silver", "Gold"],
            default:"Bronze",
        },
    },
    {
        timestamps:true,
        toJSON:{virtuals:true}
    }
);

//get fullname
userSchema.virtual("fullname").get(function(){
    return `${this.firstname} ${this.lastname}`
})

//count post show the user how post he/she has posted
userSchema.virtual("postCounts").get(function(){
    return this.posts.length;
})

//followers count
userSchema.virtual("followercount").get(function(){
    return this.followers.length;
})

//following count
userSchema.virtual("followingcount").get(function(){
    return this.following.length;
})

//no of blocked user
userSchema.virtual("blockuserCount").get(function(){
    return this.blocked.length;
})

//initial incase if the user dose not a profile photo
userSchema.virtual("initials").get(function(){
    return `${this.firstname[0]}${this.lastname[0]}`
})


const User = mongoose.model("User",userSchema);
export default User;