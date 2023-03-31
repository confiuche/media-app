//create users
export const createPostController = async(req,res)=>{
    const {title,description}=req.body;
    try{
        res.json({
            status:"success",
            data:`congratulation post successfully`
    })
    } catch(error){
        res.json(error.message);
    }   
}