import Post from "../model/PostModel.js";
import User from "../model/userModel.js"

//create post
export const createPostController = async(req,res)=>{
    const {title,description,category}=req.body;
    try{
        //obtain the user who is creating the post
        const postOwner = await User.findById(req.userAuth)
        if(postOwner.isBlocked){
            return res.json({
                status:"error",
                message:"Sorry access denied, because your account is currently blocked"
            })
        }
        const createPost = await Post.create({
            title,
            description,
            category,
            user:postOwner._id
        })

        res.json({
            status:"success",
            data:createPost
    })

//attached the post to the owner
postOwner.posts.push(createPost);
await postOwner.save()

    } catch(error){
        res.json(error.message);
    }   
}


//fetch all posts by admin
export const fetchAllPostByAdmin = async(req,res)=>{
    try {
        const posts = await Post.find({});
        res.json({
            status:"success",
            data:posts
        })

    } catch (error) {
        res.json(error.message)
    }
}

//fetch all post
export const list =async(req,res)=>{
    //fetch all post
    //populate will get all the user details instead of getting only the id
    //as to enable us get the property of the 'blocked' by user
    // and the user that is blocked by another user will not see the post
    const posts = await Post.find({})
    .populate("user")
    .populate("category","title")

    //check if the user is blocked by the post owner
    //that is why we user populate as to get the 'blocked' property
    const filterpost = posts.filter((post)=>{
        const blockedUser = post.user.blocked;

        //we check if the id of the user that is block is in 
        //the array of the user that create the post
        const isaBlocked = blockedUser.includes(req.userAuth)

        return isaBlocked?null:post

    })

    try {
        res.json({
            status:"success",
            //data:posts
            //now we will display filter
            data:filterpost
        })
    } catch (error) {
        res.json(error.message)
    }
}