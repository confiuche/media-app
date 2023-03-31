import mongoose from "mongoose";

export const database = async () =>{
    try {
        mongoose.set("strictQuery",false);

        await mongoose.connect(process.env.DB_CONNECT);
        console.log("Database connected successfully");
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}