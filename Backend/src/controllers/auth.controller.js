import User from '../model/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

async function register(req,res){

    try{
         const {username,email,password} = req.body;

        if(!username || !email || !password){
            return res.status(400)
            .json({
                message: 'Plase provide all required fields'
            })
        }

        const userExists = await User.findOne({email})

        if(userExists){
            return res.status(409).json({
                message: "User already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password,10)

        const crateUser = await User.create({
            username,
            email,
            password: hashedPassword
        })

        return res.status(201).json({
            success : true,
            message: "User created successfully",
            user:{
                id: user._id,
                username: user.username,
                email: user.email,
               
            }
        })
    }catch(error){
        console.error("Register error",error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            
        })
    }
}
async function login(req,res){
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            })
        }
        const user = await User.findOne({email}).select('+password')

        if(!user){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        )

        if(!isPasswordValid){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        )

        res.cookie('token', token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
            
        })

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user:{
                id:user._id,
                username: user.username,
                email: user.email,

            }
        })

    }catch(error){
        console.error("Login error",error)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}
async function logout(req,res){
    res.clearCookie('token',{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    })

    return res.status(200).json({
        success: true,
        message: "Logout successful"
    })
}
export {
    register,
    login,
    logout
}