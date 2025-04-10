import mongoose from 'mongoose'
import Post from '../models/post.schema.js'
import asyncHandler from '../service/asyncHandler.js'
import customError from '../service/customError.js'

export const createPost = asyncHandler(async(req, res) => {
    const { content } = req.body
    const userId = req.user._id

    if(!content || !Array.isArray(content) || content.length === 0){
        throw new customError('Post content is required and should be an array', 400)
    }
    
    const userPost = await Post.create({userId, content})
    res.status(200).json({
        success : true,
        message : 'Post created successfully',
        post : userPost
    })
})

export const updatePost = asyncHandler(async(req, res) => {
    const { content } = req.body
    const {postId} = req.params
    const userId = req.user._id

    if(!mongoose.Types.ObjectId.isValid(postId)){
        throw new customError('Invalid postId', 403)
    }
    const post = await Post.findById(postId)
    if(!post){
        throw new customError('Post not found', 400)
    }
    
    if(post.userId.toString() != userId.toString()){
        throw new customError('You can only update your own post,unauthorized access!', 400);
    }

    if(!content || !Array.isArray(content)){
        throw new customError('Content should be an array',400)
    }

    if(content){
        post.content = content;
    }

    await post.save()
    res.status(201).json({
        success : true,
        message : 'Post updated successfully',
        post
    })
})

// get posts by a specific user
export const getUserPost = asyncHandler(async(req, res) => {
    const userId  = req.user._id 

    const post = await Post.find({userId})
    if(!post || post.length === 0){
        throw new customError('Post not found for the specific user', 400)
    }

    res.status(200).json({
        success : true,
        message : 'User posts fetched successfully',
        post
    })
})

// Get a Specific Post
export const getPost = asyncHandler(async(req, res) => {
    const {postId} = req.params

    if(!mongoose.Types.ObjectId.isValid(postId)){
        throw new customError('Invalid postId', 404)
    }
    const post = await Post.findById(postId)
    if(!post){
        throw new customError('Post not found', 400)
    }

    res.status(200).json({
        success : true,
        message : 'Post fetched successfully',
        post
    })
})

export const deletePost = asyncHandler(async(req, res) => {
    const { postId } = req.params
    const userId = req.user._id

    if(!mongoose.Types.ObjectId.isValid(postId)){
        throw new customError('Invalid postId', 403)
    }
    const post = await Post.findById(postId)
    if(!post){
        throw new customError('Post not found', 400)
    }

    if(post.userId.toString() != userId.toString()){
        throw new customError('You are not allowed to delete the post, unauthorised access', 400)
    }

    await Post.deleteOne();
    res.status(200).json({
        success : true,
        message : 'Post deleted successfully'
    })
})