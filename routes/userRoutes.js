import express from 'express'
import multer from 'multer';
import storage from '../config/cloudinary.js'
import { createUserController, deleteUsersController, displayAllController, profileController, profilePhotoUploadCtrl, updateUserController, userLoginCtrl, userToFollowController } from '../controller/usersController.js';
import { isLogin } from '../middlewares/isLogin.js';
import { validateUser } from '../middlewares/userValidation.js';


const userRoutes = express.Router();

const upload = multer({storage})

//create user
userRoutes.post("/create", validateUser,createUserController);
//login user
userRoutes.post("/login",userLoginCtrl);
//get users
userRoutes.get("",isLogin,displayAllController);
//profile
userRoutes.get("/profile/:id",isLogin,profileController);
//update users
userRoutes.put("/:id", updateUserController);
//delete users
userRoutes.delete("/:id", deleteUsersController);
//upload profile
userRoutes.post("/profile-image",isLogin,upload.single("profile"),profilePhotoUploadCtrl);
//following user
userRoutes.get("/following/:id",isLogin,userToFollowController)


export default userRoutes;