import express from 'express';
import { createPostController, fetchAllPostByAdmin, list } from '../controller/postController.js';
import { isLogin } from "../middlewares/isLogin.js"
import { isAdmin } from '../middlewares/isAdmin.js'

const postRoutes = express.Router();

//Create Post
postRoutes.post("/create",isLogin, createPostController)
//list all post for admin
postRoutes.get("/list-post-admin",isLogin,isAdmin,fetchAllPostByAdmin)
//list all post
postRoutes.get("/list-post",isLogin,list)


export default postRoutes;