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
