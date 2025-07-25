import User from "../models/user.schema.js"
import asyncHandler from "../service/asyncHandler.js"
import customError from "../service/customError.js"
import { generateAccessToken, generateRefreshToken, verifyJWT } from "../utils/jwt.js"
import cookieOptions  from "../service/cookieOptions.js"
import { comparePassword } from "../utils/compare.password.js"
import { createNotification } from "../service/notification.service.js"

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

    const accessToken = generateAccessToken({_id : user._id});
    const refreshToken = generateRefreshToken({_id : user._id});

    user.refresh_token = refreshToken;
    await user.save();

    // Remove password before sending response.....for safety purpose
    user.password = undefined; 

    res.cookie('refreshToken', refreshToken, cookieOptions);

    await createNotification(
        {
            senderId: user._id,
            recieverId: user._id,
            type: 'signup',
            messageContent: `Welcome ${user.username}! Your account has been created`
        }
    );
    res.status(201).json({
        success : true,
        message : 'Signup successfull',
        token : accessToken,
        user,
    })
})

export const login = asyncHandler(async(req, res) => {
    const {email, username, password} = req.body
    if(!email && !username){
        throw new customError('Username or email is required', 400)
    }

    if(!password){
        throw new customError("Password is required for login", 400)
    }

    const user = await User.findOne({
        $or :[{email, username}],
    }).select('+password');
    
    if(!user){
        throw new customError('User does not exist', 400);
    }
    const isPasswordMatched = await comparePassword(password, user.password)
    if(!isPasswordMatched){
        throw new customError('Invalid credentials', 400)
    }

    const accessToken = generateAccessToken({_id : user._id})
    const refreshToken = generateRefreshToken({_id : user._id})

    // Save refresh token in DB
    user.refresh_token = refreshToken;
    await user.save();

    user.password = undefined;
    res.cookie('refreshToken', refreshToken, cookieOptions)

    await createNotification(
        {
            senderId: user._id,
            recieverId: user._id,
            type: 'login',
            messageContent: `Welcome ${user.username}! Logged in sucessfully`
        }
    )
    res.status(200).json({
        success : true,
        message : 'Login successfull',
        token : accessToken,
        userData : user,
    })
})

export const logout = asyncHandler(async(req, res) =>{

    // res.clearCookie("refreshToken")
    res.cookie('refreshToken', "", {
        httpOnly : true,
        secure : true,
        sameSite : "Strict",
        expires : new Date(Date.now())
    })

    const user = await User.findById(req.user._id)

    if(user){
        user.refresh_token = null,
        await user.save()
    }

    await createNotification(
        {
            senderId: user._id,
            recieverId: user._id,
            type:'logout',
            messageContent: ` ${user.username}! Logged out`
        }
    )
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

export const refreshAccessToken = asyncHandler(async (req, res) =>{
    const {refreshToken} = req.cookies;
    
    if(!refreshToken){
        throw new customError("No refresh token provided", 401)
    }

    const payload = verifyJWT(refreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(payload._id).select("-password");

    if(!user || user.refresh_token !== refreshToken){
        throw new customError("User not found or token mismatched!", 401);
    }

    const newRefreshToken = generateRefreshToken({ _id: user._id });
    user.refresh_token = newRefreshToken;
    await user.save();
    res.cookie('refreshToken', newRefreshToken, cookieOptions);
    
    const newAccessToken = generateAccessToken({_id : user._id})

    res.status(200).json({
        success : true,
        message : "New access token generated",
        accessToken : newAccessToken
    })
})