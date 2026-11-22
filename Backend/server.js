import app from "./src/app.js";
import dotenv from "dotenv";
import connectToDb from "../Backend/src/config/database.js";

dotenv.config();

const PORT = process.env.PORT || 3000;


const startServer = async()=>{
    try{
        await connectToDb()
        app.listen(PORT,()=>{
            console.log(`Backend server is runnng on port ${PORT}`)
        })
    }catch(err){
        console.log("Error while starting server",err)
        process.exit(1)
    }

}

startServer()