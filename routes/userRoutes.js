import express from 'express'
import multer from 'multer';
import storage from '../config/cloudinary.js'
import { 
    adminBlockUserCtrl, 
    adminUnBlockUserCtrl, 
    blockUserController, 
    createUserController, 
    deleteUsersController, 
    displayAllController, 
    forgetPasswordCtr, 
    profileController, 
    profilePhotoUploadCtrl, 
    unFollowerController, 
    unblockedUserController, 
    updateUserController, 
    userLoginCtrl, 
    userToFollowController 
   } from '../controller/usersController.js';
import { isLogin } from '../middlewares/isLogin.js';
import { validateUser } from '../middlewares/userValidation.js';
import { isAdmin } from '../middlewares/isAdmin.js';



const userRoutes = express.Router();

const upload = multer({storage})

//create user
userRoutes.post("/create", validateUser,createUserController);
//login user
userRoutes.post("/login",userLoginCtrl);
//get users
userRoutes.get("",isLogin,displayAllController);
//profile
userRoutes.get("/profile",isLogin,profileController);
//update users
userRoutes.put("",isLogin, updateUserController);
//delete users
userRoutes.delete("/:id", deleteUsersController);
//upload profile
userRoutes.post("/profile-image",isLogin,upload.single("profile"),profilePhotoUploadCtrl);
//following user
userRoutes.get("/following/:id",isLogin,userToFollowController);
//unfollow user
userRoutes.get("/unfollowing/:id",isLogin,unFollowerController);
//block user
userRoutes.get("/block/:id",isLogin,blockUserController);
//unblocked user
userRoutes.get("/unblock/:id",isLogin,unblockedUserController);
//admin blocked user
userRoutes.put("/admin-block-user/:id",isLogin,isAdmin,adminBlockUserCtrl);
//admin unblocked user
userRoutes.put("/admin-unblock-user/:id",isLogin,isAdmin,adminUnBlockUserCtrl);
//forget password
userRoutes.post("/forget-password", forgetPasswordCtr)


export default userRoutes;