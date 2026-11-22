import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";



const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))



app.get("/",(req,res)=>{
    res.status(201).json
    ({
        "success": true,
        "message": "server is running on port 3000"})
})

export default app;