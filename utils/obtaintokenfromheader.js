export const obtainTokenFromHeader = req =>{
    const headerDetails = req.headers;

    const token = headerDetails['authorization'].split(" ")[1];

    if(token !== undefined){
        return token;
    }else{
        return{
            status:"error",
            message:"It seems there is no token attached to the header"
        }
     
    }
}