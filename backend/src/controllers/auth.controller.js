import User from "../models/user.schema.js"
import asyncHandler from "../service/asyncHandler.js"
import customError from "../service/customError.js"
import { generateJWT } from "../utils/jwt.js"
import cookieOptions  from "../service/cookieOptions.js"
import { comparePassword } from "../utils/compare.password.js"

export const signup = asyncHandler(async(req, res) => {
    const {username, email, password} = req.body

    if(!username || !email || !password){
        throw new customError('Please provide username, email, password', 400);
    }

    const userExist = await User.findOne({email});
    if(userExist){
        throw new customError('User already exists, enter new email', 400);
    }

    const user = await User.create({
        username, email, password
    })

    const token = generateJWT({_id : user._id});

    // Remove password before sending response.....for safety purpose
    user.password = undefined; 

    res.cookie('token', token, cookieOptions);

    res.status(201).json({
        success : true,
        message : 'Signup successfull',
        user,
        token
    })
})

export const login = asyncHandler(async(req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        throw new customError('Email and password is required', 400)
    }

    const user = await User.findOne({email}).select('+password');
    
    if(!user){
        throw new customError('User does not exist', 400);
    }
    const passwordMatched = await comparePassword(password, user.password)
    if(!passwordMatched){
        throw new customError('Invalid password', 400)
    }

    const token = generateJWT({_id : user._id})
    user.password = undefined;
    res.cookie('token', token, cookieOptions)

    res.status(200).json({
        success : true,
        message : 'Login successfull',
        user,
        token
    })
})

export const logout = asyncHandler(async(req, res) =>{
    res.cookie('token', "", {
        expires : new Date(Date.now()),
        httpOnly : true
    })

    res.status(200).json({
        success : true,
        message : 'Logout successfull'
    })
})

export const getUserProfile = asyncHandler(async(req, res) =>{
    const userId = req.user._id

    const user = await User.findById(userId).select('-password')

    if(!user){
        throw new customError('User not found', 400)
    }
    res.status(200).json({
        success : true,
        message : 'User profile fetched successfully',
        user
    })
})

export const updateProfile = asyncHandler(async(req, res) => {
    const {username, bio} = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password')

    if(!user){
        throw new customError('User not found', 400)
    }

    const updatedFields = {};
    if(username){
        updatedFields.username = username
    }
    if(bio){
        updatedFields.bio = bio
    }

    // Check if files were uploaded by multer 
    if(req.files){

        // req.files.profile_picture is an array of files
        if(req.files.profile_picture){
            updatedFields.profile_picture = {
                secure_url : req.files.profile_picture[0].path
            };
        }

        if(req.files.profile_cover){
            updatedFields.profile_cover = {
                secure_url : req.files.profile_cover[0].path
            }
        }
    }

    const updatedProfile = await User.findByIdAndUpdate(userId, updatedFields, { new: true, runValidators: true }).select('-password')
    res.status(200).json({
        success : true,
        message : 'Profile updated successfully',
        updatedProfile
    })
})