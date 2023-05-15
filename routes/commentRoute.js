import express from 'express';
import { isLogin } from '../middlewares/isLogin.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import multer from 'multer';
import storage from '../config/cloudinary.js';
import { createComment, deleteCommentCtr, updateCommentCtr } from '../controller/commentController.js';

const commentRoutes = express.Router();
const upload = multer({storage})

commentRoutes.post("/:id",isLogin,createComment);
commentRoutes.put("/:id", isLogin, updateCommentCtr);
commentRoutes.delete("/:id", isLogin, deleteCommentCtr);

export default commentRoutes;