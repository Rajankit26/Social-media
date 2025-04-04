import asyncHandler from "../service/asyncHandler.js";
import customError from "../service/customError.js";
import User from "../models/user.schema.js"
import {verifyJWT} from '../utils/jwt.js'

export const verifyToken = asyncHandler(async(req, res, next) =>{
    let token;
    if(req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))){
        token = req.cookies.token || req.headers.authorization.split(" ")[1]
    }

    if(!token){
        throw new customError('Unauthorized access!', 400)
    }
    try {
        const payload = verifyJWT(token)
        req.user = await User.findById(payload._id, 'username email bio')

        if(!req.user){
            throw new customError('User no longer exist', 400)
        }
        next()
    }catch (error) {
        throw new customError('Invalid or expired token', 401)
    }
})