import express from 'express';
import { createPostController, deletPost, deletPostByAdmin, fetchAllPostByAdmin, fetchPostByUser, getSinglePost, list } from '../controller/postController.js';
import { isLogin } from "../middlewares/isLogin.js"
import { isAdmin } from '../middlewares/isAdmin.js'
import multer from 'multer';
import storage from '../config/cloudinary.js'

const upload = multer({storage});
const postRoutes = express.Router();

//Create Post
postRoutes.post("/create",isLogin,upload.single("image"), createPostController)
//list all post for admin
postRoutes.get("/list-post-admin",isLogin,isAdmin,fetchAllPostByAdmin)
//list all post
postRoutes.get("/list-post",isLogin,list)
//fetch all post by user
postRoutes.get("/user/:id",isLogin,fetchPostByUser)
//get single post
postRoutes.get("/:id",isLogin,getSinglePost);
//delete post by user
postRoutes.delete("/:id",isLogin,deletPost);
//delete post
postRoutes.delete("/admin/:id",isLogin,isAdmin,deletPostByAdmin);


export default postRoutes;