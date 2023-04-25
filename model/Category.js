import mongoose,{Schema} from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            require:true,
        },
        title:{
            type:String,
            required:true,
        },
    },
    {
        timestamps:true,
    }
);
const Category = mongoose.model("Category",categorySchema);
export default Category;