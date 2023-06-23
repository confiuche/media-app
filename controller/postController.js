import mongoose from "mongoose";
import Post from "../model/PostModel.js";
import User from "../model/userModel.js"
import AppError from "../utils/AppErr.js";

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
            user:postOwner._id,
            photo: req?.file?.path,
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
    .populate("comments");

    //check if the user is blocked by the post owner
    //that is why we user populate as to get the 'blocked' property
    const filterpost = posts.filter((post) => {
        const blockedUser = post.user.blocked;

        //we check if the id of the user that is block is in 
        //the array of the user that create the post
        const isaBlocked = blockedUser.includes(req.userAuth)

        return isaBlocked ? null : post;

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
        return res.json({
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
    const postId  = req.params.id;
    // const loggedUser = req.userAuth;
    const post = await Post.findById(postId)

    const userDeletePost = post.user.toString() === req.userAuth.toString()
  
    // const post = await Post.findOne({_id:mongoose.Types.ObjectId(postId), user:loggedUser})
  // 644a69efb37ad08258fd5e3c
  if(!post){
    return res.json({
      status: "error",
      message: "Post not found",
    })
  }

  if(!userDeletePost){
    return res.json({
      status:"error",
      message:"you are Unable to delete this post"
    })
  }


  if(userDeletePost){
  await post.delete();
  res.json({
    status:"success",
    message:"post deleted successfully"
  })
}
  }catch (error) {
      res.json(error.message);
    }
  }





//   //delete post
// export const deletPost = async (req, res) => {
//     //find post
//     try{
//     const postId  = req.params;
//     const loggedUser = req.userAuth;
  
//     const post = await Post.findOne({_id:mongoose.Types.ObjectId(postId), user:loggedUser})
  
//   if(!post){
//     return res.json({
//       status: "error",
//       message: "Post not found",
//     })
//   }
//   await post.delete();
//   res.json({
//     status:"success",
//     message:"post deleted successfully"
//   })
//   }catch (error) {
//       res.json(error.message);
//     }
//   }



// delete post by admin
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



  //update post
export const updatePostController = async (req, res) => {
  const { title, description, category } = req.body;
  try {
    const postId = req.params.id;
    //obtain the post
    const post = await Post.findById(postId);
    //check the post exists
    if (!post) {
      return res.json({
        status: "error",
        message: "Sorry post not found!"
      });
    }

    //check if the post belongs to the cureent user
    const isPostBelongToCurrentUser =
      post.user.toString() === req.userAuth.toString();
    if (!isPostBelongToCurrentUser) {
      return res.json({
        status: "error",
        message: "Access denied",
      });
    }
    //now updaste the post

    const postUpdate = await Post.findByIdAndUpdate(
      postId,
      {
        title,
        description,
        category,
        photo: req?.file?.path,
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      data: postUpdate,
    });
  } catch (error) {
    res.json(error.message);
  }
};



//likes and dislikes toggles

export const likesToggleCtr = async (req, res) => {
  try {
    //get post
    const postId = req.params.id;
    const post = await Post.findById(postId);
    //check if the post exists
    if (!post) {
      return res.json({
        status: "error",
        message: "post not found",
      });
    }
    //check if the post belongs to the user

    const isPostBelongToCurrentUser =
      post.user.toString() === req.userAuth.toString();

    if (isPostBelongToCurrentUser) {
      return res.json({
        status: "error",
        message: "You cannot like your own post",
      });
    }
    //check if the post has been liked by the same
    const isPostLike = post.likes.includes(req.userAuth);
    if (isPostLike) {
      post.likes = post.likes.filter(
        (like) => like.toString() !== req.userAuth.toString()
      );
      await post.save();
    } else {
      post.likes.push(req.userAuth);
      await post.save();
    }
    res.json({
      status: "sucess",
      data: post,
    });
  } catch (error) {
    res.json(error.message);
  }
};

//dislikes
export const disLikesToggle = async (req, res) => {
  try {
    //get the post

    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.json({
        status: "error",
        message: "post not found",
      });
    }
    //check if the post belong to the user
    const isPostBelongToCurrentUser =
      post.user.toString() === req.userAuth.toString();
    if (isPostBelongToCurrentUser) {
      return res.json({
        status: "error",
        message: "You can't dislike your own post",
      });
    }

    const isPostDislike = post.dislikes.includes(req.userAuth);
    if (isPostDislike) {
      post.dislikes = post.dislikes.filter(
        (dislike) => dislike.toString() !== req.userAuth.toString()
      );

      await post.save();
    } else {
      post.dislikes.push(req.userAuth);
      await post.save();
    }

    res.json({
      status: "success",
      data: post,
    });
  } catch (error) {
    res.json(error.message);
  }
};

//viwecount
export const viewCount = async (req, res) => {
  try {
    //get the post
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!postId) {
      return res.json({
        status: "error",
        message: "Post not found",
      });
    }

    //check if the particular includes the logged user id
    const postView = post.numView.includes(req.userAuth);
    if (postView) {
      return res.json({
        status: "error",
        message: "You have already view this post",
      });
    }
    post.numView.push(req.userAuth);
    await post.save();

    res.json({
      status: "success",
      data: post,
    });
  } catch (error) {
    res.json(error.message);
  }
};



//list all post
export const displayALLpost = async (req, res, next) => {
  const { title } = req.query;
  try {
    let posts = Post.find({}).populate("user")
    .populate("category","title")
    .populate("comments");

    if (title) {
      posts = posts.find({
        title: { $regex: title, $options: "i" },
      });
    }

    //pagination
    //page
    const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    //limit
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;

    //startIndex
    const startIndex = (page - 1) * limit;
    //endIndex
    const endIndex = page * limit;
    //total
    const total = await Post.countDocuments();

    posts  = posts.skip(startIndex).limit(limit)

  //resut from pagination
  const pagination = {}
  if(endIndex < total){
    pagination.next = {
      page: page + 1,
      limit
      }
  }

if(startIndex > 0){
  pagination.prev = {
    page: page - 1,
    limit
  }
}

    const postresult = await posts;
    res.json({
      status: "success",
      result:postresult.length,
      pagination,
      message:"Posts fetched successfully",
      data: postresult,
    });
  } catch (error) {
    next(AppError(error.message));
  }
};