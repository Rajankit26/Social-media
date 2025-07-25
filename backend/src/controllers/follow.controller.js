import mongoose from 'mongoose'
import Follow from '../models/follow.schema.js'
import asyncHandler from '../service/asyncHandler.js'
import customError from '../service/customError.js'
import { createNotification } from '../service/notification.service.js'
import User from "../models/user.schema.js"

export const followUser = asyncHandler(async(req, res) =>{
    const {userId1} = req.params
    const userId = req.user._id

    if(!mongoose.Types.ObjectId.isValid(userId1)){
        throw new customError('Invalid userId', 400)
    }

    const doesUserExist = await User.findById(userId1);
    if(!doesUserExist){
        throw new customError('User does not exist in DB whom you want to follow', 400);
    }
    if(userId.toString() === userId1.toString()){
        throw new customError('User cannot follow themselves', 400)
    }
    const alreadyFollows = await Follow.findOne({followerId : userId, followingId : userId1})
    if(alreadyFollows){
        throw new customError('User already in the following list', 400)
    }
    

    const followingList = await Follow.create({
        followerId : userId,
        followingId : userId1
    })
    const follwerId = await User.findById(req.user);
    await createNotification(
        {
            senderId: req.user._id,
            recieverId: userId1,
            type: 'follow',
            messageContent: `${follwerId.username} started following ${userId1.username}`
        }
    )
    res.status(200).json({
        success : true,
        message : 'User followed successfully!',
        followingList
    })
})

export const unfollowUser = asyncHandler(async(req, res) =>{
    const {userId1} = req.params
    const userId = req.user._id
    if(!mongoose.Types.ObjectId.isValid(userId1)){
        throw new customError('Invalid userId', 400)
    }

    if(userId.toString() === userId1.toString()){
        throw new customError('User cannot unfollow themselves', 400)
    }
    const isInFollowingList = await Follow.findOne(
        {
            followerId : userId,
            followingId : userId1
        }
    )

    if(!isInFollowingList){
        throw new customError('User not in the following list, cannot unfollow', 400)
    }

    const unfollow = await Follow.findOneAndDelete(
        {
            followerId : userId,
            followingId : userId1
        }
    )

    res.status(200).json({
        success : true,
        message : 'User unfollowed successfully',
        unfollowedUser : unfollow
    })
})

export const getFollowers = asyncHandler(async(req, res) =>{
    const userId = req.user._id
    const followersList = await Follow.find({followingId :userId})

    res.status(200).json({
        success : true,
        message : 'Followers list fetched successfully',
        followers : followersList
    })
})

export const followersCount = asyncHandler(async(req, res) =>{
    const userId = req.user._id

    const followersList = await Follow.find({followingId :userId})
    const followersCount = followersList.length;
    res.status(200).json({
        success : true,
        message : 'Followers count fetched successfully',
        CountOffollowers : followersCount
    })
})