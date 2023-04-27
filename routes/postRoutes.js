import express from 'express';
import { createPostController } from '../controller/postController.js';
import { isLogin } from "../middlewares/isLogin.js"

const postRoutes = express.Router();

postRoutes.post("/create",isLogin, createPostController)

export default postRoutes;