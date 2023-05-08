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


//get post associate to a particular users
//fetch post created by a particular user
export const fetchPostByUser = async (req, res) => {
    const userPost = await Post.find({user:req.params.id})
    
    
    try {
        res.json({
        status:"success",
        data:userPost
        })
    
    }catch (error) {
        res.json(error.message)
    }
    
}


//get single post
export const getSinglePost = async (req, res) => {
    try {
      const singlepost = await Post.findById(req.params.id);
      if (!singlepost) {
        res.json({
          status: "error",
          message: "post not found",
        });
      }
      res.json({
        status: "success",
        data: singlepost,
      });
    } catch (error) {
      res.json(error.message);
    }
  };
  


  //delete post
export const deletPost = async (req, res) => {
    //find post
    try{
    const postId  = req.params;
    const loggedUser = req.userAuth;
  
    const post = await Post.findOne({_id:mongoose.Types.ObjectId(postId), user:loggedUser})
  
  if(!post){
    return res.json({
      status: "error",
      message: "Post not found",
    })
  }
  await post.delete();
  res.json({
    status:"success",
    message:"post deleted successfully"
  })
  }catch (error) {
      res.json(error.message);
    }
  }



// deletepost by admin
export const deletPostByAdmin = async (req, res) => {
    const post = await Post.findById(req.params.id);
    try {
      if (!post) {
        return res.json({
          status: "error",
          message: "post not found",
        });
      }
      await post.remove();
      res.json({
        status: "success",
        data: "post deleted successfully",
      });
    } catch (error) {
      res.json(error.message);
    }
  };