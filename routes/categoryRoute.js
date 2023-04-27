import express from 'express'
import { isLogin } from '../middlewares/isLogin.js';
import { validateUser } from '../middlewares/userValidation.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { createCategory, deleteCategory, displaySingleCategory, list, updateCategory } from '../controller/categoryController.js';


const categoryRoutes = express.Router();

//create category
categoryRoutes.post("",isLogin,isAdmin,createCategory)
//display list
categoryRoutes.get("",list)
//get single category
categoryRoutes.get("/:id",isLogin,displaySingleCategory)
//delete category
categoryRoutes.delete("/:id",isLogin,isAdmin,deleteCategory)
//update category
categoryRoutes.put("/:id",isLogin,updateCategory)

export default categoryRoutes;