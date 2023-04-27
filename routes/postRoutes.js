import express from 'express';
import { createPostController, fetchAllPostByAdmin } from '../controller/postController.js';
import { isLogin } from "../middlewares/isLogin.js"
import { isAdmin } from '../middlewares/isAdmin.js'

const postRoutes = express.Router();

//Create Post
postRoutes.post("/create",isLogin, createPostController)
//list all post by admin
postRoutes.get("",isLogin,isAdmin,fetchAllPostByAdmin)

export default postRoutes;