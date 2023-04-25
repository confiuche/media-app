import express from 'express'
import { isLogin } from '../middlewares/isLogin.js';
import { validateUser } from '../middlewares/userValidation.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { createCategory, list } from '../controller/categoryController.js';


const categoryRoutes = express.Router();

//create category
categoryRoutes.post("",isLogin,isAdmin,createCategory)
//display list
categoryRoutes.get("",list)

export default categoryRoutes;