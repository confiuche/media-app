import User from "../model/userModel.js";
import bcrypt from 'bcrypt';
import generateToken from "../utils/generateToken.js";
import { obtainTokenFromHeader } from "../utils/obtaintokenfromheader.js";
import AppError from "../utils/AppErr.js"
import jwt from 'jsonwebtoken'



//create users
export const createUserController = async(req, res, next)=>{
    const {firstname,lastname,profilephoto,email,password} = req.body;
    try{
        //check if user has been registered before
        const foundUser = await User.findOne({email});
            if(foundUser){
                return next(AppError("User with that email already exists", 409))
            }else{
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);
                const user = await User.create({
                    firstname,
                    lastname,
                    email,
                    password:hashPassword,
                })
            

           res.json({ 
            status:"success",
            data:user
    });
}
    } catch(error){
        res.json(error.message);
    }   
}


//login user
export const userLoginCtrl = async (req,res,next)=>{
    const {email,password} = req.body;
    try {
        //get email
        const isUserFound = await User.findOne({email});
        if(!isUserFound){
            return next(AppError("Wrong login credential"))
        }

        //get password
        const isPasswordFound = await bcrypt.compare(password,isUserFound.password);
        if(!isPasswordFound){
          return next(AppError("Wrong login credential"))

        }
        res.json({
            status:"success",
            data:{
            firstname: isUserFound.firstname,
            lastname: isUserFound.lastname,
            email: isUserFound.email,
            token: generateToken(isUserFound._id)
            }
        })

    }catch(error){
        next(AppError(error.message))
    }
}

// profile
export const profileController = async(req, res,next) => {
    //const userid = req.params.id;
    //console.log(userid);
    //console.log(req.headers);
    try{
        const token = obtainTokenFromHeader(req);
        //console.log(token);
        //console.log(req.userAuth);
        const foundUser = await User.findById(req.userAuth);
        if(!foundUser){
        return next(AppError("No user associated with that id", 404))

}

            res.json({
            status:"success",
            data:foundUser,
           });

    } catch(error){
        next(AppError(error.message))
    }   
};


// display all users
export const displayAllController = async(req,res)=>{
  try{
      const users = await User.find({});
      res.json({
          status:"success",
          data:users
  })
  } catch(error){
      next(AppError(error.message));
  }
}



//update users
export const updateUserController = async(req,res)=>{
    //const userid = req.params.id;
    try{
      console.log()
      const updateUser = await User.findByIdAndUpdate(req.userAuth,{
        
        $set:{
          email:req.body.email
        }
      },{
        new:true
      })
        res.json({
            status:"success",
            data:updateUser
    })
    } catch(error){
        next(AppError(error.message))
    }
}


//delete users
export const deleteUsersController = async(req,res)=>{
    const userid = req.params.id;
    try{
        res.json({
            status:"success",
            data:"User account deleted successfully"
    })
    } catch(error){
        next(AppError(error.message))
    }   
}


//upload profile photo
export const profilePhotoUploadCtrl = async(req, res, next) =>{
    try {
        //find the user whose is uploading profile
        const userProfileToBeUpdated = await User.findById(req.userAuth);
        if(!userProfileToBeUpdated){
            res.json({
                status:"error",
                message:"User not found"
            })
        }

        //check if user is blocked
        if(userProfileToBeUpdated.isBlocked){
            return res.json({
                status:"error",
                message:"Access denied because your account is presently blocked"
            })
        }

        console.log(req.file);
        if(req.file){
            await User.findByIdAndUpdate(req.userAuth,{
                $set:{
                    profilephoto:req.file.path
                },
            },{
                new:true
            }
                );
                res.json({
                    status:"success",
                    data:"profile image uploaded successfully"
                })
        }


        
    } catch (error) {
        res.json(error.message)
    }
}



//User to follow
export const userToFollowController = async (req, res) =>{

    try {
//find user to follow
const userToFollow = await User.findById(req.params.id);
//console.log(userToFollow);

//find user who is following
const userwhoisfollowing = await User.findById(req.userAuth);
//console.log(userwhoisfollowing);

if(userToFollow && userwhoisfollowing){
    const userAlreadyfollowed = userToFollow.followers.find((follower)=>follower.toString() === userwhoisfollowing._id.toString())
  
    //check if the condition is true
    if(userAlreadyfollowed){
        return res.json({
            status:"error",
            message:"You have previously following this user"
        });
    }else{
        //push user that followed to the user followers array
        userToFollow.followers.push(userwhoisfollowing._id)
        //push that is following
        userwhoisfollowing.following.push(userToFollow._id)

        await userToFollow.save();
        await userwhoisfollowing.save();

        res.json({
            status:"success",
            data:`You have successfully followed this user ${userToFollow.firstname}`
        })
    }

}

        
    } catch (error) {
        res.json(error.message)
    }

}


//unfollowing controller
export const unFollowerController = async (req,res)=>{
    try {

        //get the user to unfollow
        const userToUnfollow = await User.findById(req.params.id)
        //console.log(userToUnfollow._id);

        //get the id of the user that want to unfollow another
        const userthatwanttounfollow = await User.findById(req.userAuth);

        //check if user to unfollow and user that want to unfollow another user is valid
        if(userToUnfollow && userthatwanttounfollow){
            //check if user to unfollow is already in the user follower array

            const isUserAlreadyUnfollow = userToUnfollow.followers.find(
                (follower) => 
                follower.toString() === userthatwanttounfollow._id.toString());
            //console.log(isUserAlreadyUnfollow);

            if(!isUserAlreadyUnfollow){
                res.json({
                    status:"error",
                    message:"You have followed this user"
                });
            }else{
                //remove the user who unfollow from the follower's array
                userToUnfollow.followers = userToUnfollow.followers.filter(
                    (follower) => 
                    follower.toString() !== userthatwanttounfollow._id.toString()
                    );
                //save
                await userToUnfollow.save();

                //remove user to be unfollowed from the user who is following
                userthatwanttounfollow.following = 
                userthatwanttounfollow.following.filter(
                    (following) =>
                following.toString() !== userToUnfollow._id.toString()
                );
                //save
                await userthatwanttounfollow.save()

                res.json({
                    status:"success",
                    data:"You have successfully unfollow this user"
                });
            }

        }
      
    } catch (error) {
        res.json(error.message)
    }
};


//Block User Controller
export const blockUserController = async (req, res) => {
    try {
      //1 find the user that we want to be blocked
      const userToBeBlocked = await User.findById(req.params.id);
      // console.log(userToBeBlocked);
      //2 user that want to block another user
      const userThatWantToBlockAnotherUser = await User.findById(req.userAuth);
      // console.log(userThatWantToBlockAnotherUser);
  
      //check if 1 and 2
      if (userToBeBlocked && userThatWantToBlockAnotherUser) {
        //check if the this user has been previously been blocked
  
        const isUserAlreadyBeenBlocked =
          userThatWantToBlockAnotherUser.blocked.find(
            (blocked) => blocked.toString() === userToBeBlocked._id.toString()
          );
        if (isUserAlreadyBeenBlocked) {
          return res.json({
            status: "error",
            message: "You have already blocked this user",
          });
        }
  
        //block the user
        userThatWantToBlockAnotherUser.blocked.push(userToBeBlocked._id);
  
        //save
        await userThatWantToBlockAnotherUser.save();
        res.json({
          status: "success",
          data: "You have blocked this user",
        });
      }
    } catch (error) {
      res.json(error.message);
    }
  };



  //ublocked user Controller
export const unblockedUserController = async (req, res) => {
    try {
      //1. find the user to be unblocked
  
      const userToBeUnBlocked = await User.findById(req.params.id);
      //2. find the user that want to unblocked another user
      const userThatWantToUnBlockedAnotherUser = await User.findById(
        req.userAuth
      );
  
      //check if 1 and 2 exists
  
      if (userToBeUnBlocked && userThatWantToUnBlockedAnotherUser) {
        const isUserAlreadyUnBlocked =
          userThatWantToUnBlockedAnotherUser.blocked.find(
            (block) => block.toString() === userToBeUnBlocked._id.toString()
          );
        if (!isUserAlreadyUnBlocked) {
          return res.json({
            status: "error",
            message: "You have not blocked this user",
          });
        }
  
        //remove the user from blocked array
        userThatWantToUnBlockedAnotherUser.blocked =
          userThatWantToUnBlockedAnotherUser.blocked.filter(
            (blocked) => blocked.toString() !== userToBeUnBlocked._id.toString()
          );
        //save
        userThatWantToUnBlockedAnotherUser.save();
        res.json({
          status: "success",
          data: "You have successfully unblocked this user",
        });
      }
    } catch (error) {
      res.json(error.message);
    }
  };


  //admin block user
export const adminBlockUserCtrl = async (req, res) => {
    try {
      //find the id of the users to be blocked
      const userToBeBlocked = await User.findById(req.params.id);
      if (!userToBeBlocked) {
        return res.json({
          status: "error",
          message: "User not found",
        });
      }
  
      const adminUser = await User.findById(req.userAuth);
  
      //change the isblocked to true
      userToBeBlocked.isBlocked = true;
      //save
      await userToBeBlocked.save();
      res.json({
        status: "success",
        data: `${adminUser.firstname}, You have blocked this user successfull`,
      });
    } catch (error) {
      res.json(error.message);
    }
  };
  
  //admin to unblocked the user
  
  export const adminUnBlockUserCtrl = async (req, res) => {
    try {
      //get the id of the user to be unblocked
      const userToBeUnBlockedByAdmin = await User.findById(req.params.id);
      //check if user is found
      if (!userToBeUnBlockedByAdmin) {
        return res.json({
          status: "error",
          message: "User not found",
        });
      }
      if (!userToBeUnBlockedByAdmin.isBlocked) {
        return res.json({
          status: "error",
          message: "You have not blocked this user",
        });
      }
      userToBeUnBlockedByAdmin.isBlocked = false;
      userToBeUnBlockedByAdmin.save();
  
      res.json({
        status: "success",
        data: "You have successfully unblocked this user",
      });
    } catch (error) {
      res.json(error.message);
    }
  };


  //forget password
  export const forgetPasswordCtr = async (req, res, next) => {
    try {
      const {email} = req.body;
      //check if email is valid
      const user = await User.findOne({email});
      if(!user){
        return next(AppError(`user with ${email} does not exist`,404))
      }

      //generate a reset token
      const resetToken = jwt.sign({userId: user._id}, process.env.JWT_KEY,{
        expiresIn:'1h'
      })

      //set the  reset token and its expiration on the user obj

      user.resetToken = resetToken;
      user.reseTokenExpiration = Date.now() + 3600000;
      
      user.save()
      //send password reset email
      const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
      const html = `<h3>RESET PASSWORD</h3><br/> Below is the link to reset your password<br>This link only valid for 1 hour, please do not share with anyone<hr/><br/>click <strong><a href='${resetUrl}'>here</a></strong> to reset your password</p><p>Having any issue? kindly contact our support team</p>`
      await sendEmail(user.email,'Reset Your Password', html);

      //console.log(resetUrl);

      res.status(200).json({
        status:"success",
        message:`Password reset sent successfully to your email ${user.email}` 
      });

    } catch (error) {
      next(AppError(error.message))
    } 
  }


  