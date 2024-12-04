import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";

export const signup = async(req , res , next)=>{
    const{username , email , password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password , 10);
    const newuser = new User({username , email , password:hashedPassword})
    try {
        await newuser.save()
        res.status(201).json("User created successfully")
        
    } catch (error) {
        next(error)
    }
}