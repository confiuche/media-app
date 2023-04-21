import User from "../model/userModel.js";
import bcrypt from 'bcrypt';
import generateToken from "../utils/generateToken.js";
import { obtainTokenFromHeader } from "../utils/obtaintokenfromheader.js";




//create users
export const createUserController = async(req,res)=>{
    const {firstname,lastname,profilephoto,email,password} = req.body;
    try{
        //check if user has been registered before
        const foundUser = await User.findOne({email});
            if(foundUser){
                return res.json({
                    status:"error",
                    message:"User with that email already exists",
                })
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


// display all users
export const displayAllController = async(req,res)=>{
    try{
        const users = await User.find({});
        res.json({
            status:"success",
            data:users
    })
    } catch(error){
        res.json(error.message);
    }
}

//login user
export const userLoginCtrl = async (req,res)=>{
    const {email,password} = req.body;
    try {
        //get email
        const isUserFound = await User.findOne({email});
        if(!isUserFound){
            return res.json({
                message:"Wrong login credential",
            })
        }

        //get password
        const isPasswordFound = await bcrypt.compare(password,isUserFound.password);
        if(!isPasswordFound){
            return res.json({
                message:"Wrong login credential"
            })

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
        res.json(error.message);
    }
}

// profile
export const profileController = async(req, res) => {
    //const userid = req.params.id;
    //console.log(userid);
    //console.log(req.headers);
    try{
        const token = obtainTokenFromHeader(req)
        //console.log(token);
        //console.log(req.userAuth);
        const foundUser = await User.findById(req.userAuth);
        if(!foundUser){
        return res.json({
            status:"error",
            message:"No user associated with that id",
    });

}

            res.json({
            status:"success",
            data:foundUser,
           });

    } catch(error){
        res.json(error.message);
    }   
};


//update users
export const updateUserController = async(req,res)=>{
    const userid = req.params.id;
    try{
        res.json({
            status:"success",
            data:"User account updated successfully "
    })
    } catch(error){
        res.json(error.message);
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
        res.json(error.message);
    }   
}


//upload profile photo
export const profilePhotoUploadCtrl = async(req, res) =>{
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