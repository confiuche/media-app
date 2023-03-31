import express from 'express';
import { createPostController } from '../controller/postController.js';

const postRoutes = express.Router();

postRoutes.post("/create", createPostController)

export default postRoutes;