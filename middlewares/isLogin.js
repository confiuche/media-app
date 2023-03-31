import { obtainTokenFromHeader } from "../utils/obtaintokenfromheader.js"
import { verifyToken } from "../utils/verifytoken.js";


export const isLogin = (req, res, next)=>{
    //get token header
    const token = obtainTokenFromHeader(req);

    //verify
    const userDeCoded = verifyToken(token);

    req.userAuth = userDeCoded.id;

    if(!userDeCoded){
        return res.json({
            status:"error",
            message:"Kindly login, because it seems the token is either expired or invalid"
        })
    }else{
        next()
    }
}