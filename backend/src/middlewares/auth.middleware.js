import asyncHandler from "../service/asyncHandler.js";
import customError from "../service/customError.js";
import User from "../models/user.schema.js"
import {verifyJWT} from '../utils/jwt.js'
import dotenv from "dotenv"
dotenv.config()

export const verifyAccessToken = asyncHandler(async(req, res, next) =>{
    let accessToken;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        accessToken = req.headers.authorization.split(" ")[1]
    }

    if(!accessToken){
        throw new customError('Access token missing or unauthorized access', 400)
    }
    try {
        const payload = verifyJWT(accessToken, process.env.ACCESS_TOKEN_SECRET)

        if(!payload){
            throw new customError("Invalid token", 400)
        }
        req.user = await User.findById(payload._id).select("-password")
        if(!req.user){
            throw new customError('User no longer exist', 400)
        }
        next()
    }catch (error) {
        throw new customError('Invalid or expired token', 401)
    }
})