import express from "express";
import {register, login, logout,getMe} from "../controllers/auth.controller.js";
import authMiddleware from "../middilewares/auth.middleware.js";

const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/logout",authMiddleware,logout);
router.get("/getme",authMiddleware,getMe);

export default router;