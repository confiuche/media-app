import express from 'express'
import { createUserController, deleteUsersController, displayAllController, profileController, updateUserController, userLoginCtrl } from '../controller/usersController.js';
import { isLogin } from '../middlewares/isLogin.js';


const userRoutes = express.Router();

//create user
userRoutes.post("/create", createUserController);
//login user
userRoutes.post("/login",userLoginCtrl);
//get users
userRoutes.get("",isLogin,displayAllController);
//profile
userRoutes.get("/profile",isLogin,profileController);
//update users
userRoutes.put("/:id", updateUserController);
//delete users
userRoutes.delete("/:id", deleteUsersController);


export default userRoutes;