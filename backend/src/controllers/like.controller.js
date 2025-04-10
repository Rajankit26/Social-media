import mongoose from 'mongoose'
import Like from '../models/like.schema.js'
import Post from '../models/post.schema.js'
import asyncHandler from '../service/asyncHandler.js'
import customError from '../service/customError.js'

export const likePost = asyncHandler(async(req, res) =>{
    const {postId} = req.params
    const userId = req.user._id

    if(!mongoose.Types.ObjectId.isValid(postId)){
        throw new customError('Invalid postId', 403)
    }

    const post = await Post.findById(postId)
    if(!post){
        throw new customError('Post not found', 400)
    }

    // Ensure user hasn't already like the post 
    const isLiked = await Like.findOne({userId, postId})
    if(isLiked){
        throw new customError('Post already liked by the user', 400)
    }

    const like = await Like.create({userId, postId});
    res.status(201).json({
        success : true,
        mesaage : 'Post liked successfully',
        like
    })
})

export const dislikePost = asyncHandler(async(req, res) => {
    const {postId} = req.params
    const userId = req.user._id

    if(!mongoose.Types.ObjectId.isValid(postId)){
        throw new customError('Invalid postId', 400)
    }

    const post = await Post.findById(postId)

    if(!post){
        throw new customError('Post does not exist', 400)
    }

    const postAlreadyLiked = await Like.findOne({userId, postId})
    if(!postAlreadyLiked){
        throw new customError("can't dislike the post as it is not liked by the user", 400)
    }

    await postAlreadyLiked.deleteOne()

    res.status(201).json({
        success : true,
        message : 'Post disliked successfully!'
    })
})

export const getLikes = asyncHandler(async(req, res) =>{
    const {postId} = req.params

    if(!mongoose.Types.ObjectId.isValid(postId)){
        throw new customError('Invalid postId', 400)
    }

    const allLikes = await Like.find({ postId }).select('+userId')
    const usersList = []
    
    for(let i = 0; i < allLikes.length; i++){
        usersList.push(allLikes[i].userId)
    }
    let likeCount = usersList.length

    res.status(200).json({
        success : true, 
        message : 'Fetched all likes successfully',
        usersList,
        likeCount
    })
})