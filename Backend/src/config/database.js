import mongoose from "mongoose";

const connectToDb = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database connected successfully")
    }catch(err){
        console.log("Error while connecting to database",err)
    }
}

export default connectToDb;