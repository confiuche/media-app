import express from 'express';
import { createPostController, fetchAllPostByAdmin, fetchPostByUser, list } from '../controller/postController.js';
import { isLogin } from "../middlewares/isLogin.js"
import { isAdmin } from '../middlewares/isAdmin.js'

const postRoutes = express.Router();

//Create Post
postRoutes.post("/create",isLogin, createPostController)
//list all post for admin
postRoutes.get("/list-post-admin",isLogin,isAdmin,fetchAllPostByAdmin)
//list all post
postRoutes.get("/list-post",isLogin,list)
//fetch all post by user
postRoutes.get("/user/:id",isLogin,fetchPostByUser)


export default postRoutes;