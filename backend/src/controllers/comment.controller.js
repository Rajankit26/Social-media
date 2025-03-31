import mongoose from 'mongoose'
import Comment from '../models/comment.schema.js'
import Post from '../models/post.schema.js'
import asyncHandler from '../service/asyncHandler.js'
import customError from '../service/customError.js'

export const addComment = asyncHandler(async(req, res) =>{
    const {postId} = req.params
    const {commentText} = req.body
    const userId = req.user._id

    if(!mongoose.Types.ObjectId.isValid(postId)){
        throw new customError('Invalid postId', 400)
    }

    const post = await Post.findById(postId)
    if(!post){
        throw new customError('Post does not exist', 400)
    }

    if(!commentText){
        throw new customError("Comment text can't be empty", 400)
    }
    const comments = await Comment.create({
        userId, postId, commentText : commentText.trim()
    })

    res.status(200).json({
        success : true,
        message : 'Comment added successfully!',
        comments
    })
})

export const getAllComments = asyncHandler(async(req, res) =>{
    const {postId} = req.params
    
    if(!mongoose.Types.ObjectId.isValid(postId)){
        throw new customError('Invalid postId', 400)
    }

    const post = await Post.findById(postId)
    if(!post){
        throw new customError('Post does not exist', 400)
    }

    const allComments = await Comment.find({postId});
    if(allComments.length === 0){
        throw new customError('Comments not found for this post', 400)
    }
    res.status(200).json({
        sucess : true,
        message : 'All comments fetched successfully',
        comments : allComments
    })
})

export const getComment = asyncHandler(async(req, res) =>{
    const {postId} = req.params
    const userId = req.user._id

    if(!mongoose.Types.ObjectId.isValid(postId)){
        throw new customError('Invalid postId', 400)
    }

    const post = await Post.findById(postId)

    if(!post){
        throw new customError('Post not found', 400)
    }
    
    const comment = await Comment.find({userId, postId})
    if(comment.length === 0){
        throw new customError('Comment not found for the user', 400)
    }

    res.status(200).json({
        success : true,
        message : 'Comment fetched for the user successfully!',
        comment
    })
})

export const editComment = asyncHandler(async(req, res) =>{
    const {postId} = req.params
    const {commentText} = req.body
    const userId = req.user._id

    if(!mongoose.Types.ObjectId.isValid(postId)){
        throw new customError('Invalid postId', 400)
    }

    const post = await Post.findById(postId)
    if(!post){
        throw new customError('Post not found', 400)
    }
    
    if(!commentText){
        throw new customError('Comment text is required to update the comment', 400)
    }
    const editedComment = await Comment.findOneAndUpdate({userId, postId}, {commentText}, {new : true, runValidators : true})

    if(!editedComment){
        throw new customError('Comment not found or not authorised', 400)
    }
    res.status(200).json({
        success : true,
        message : 'Comment updated successfully',
        editedComment
    })
})

export const deleteComment = asyncHandler(async(req, res) =>{
    const {commentId} = req.params
    const userId = req.user._id

    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new customError('Invalid commentId', 400)
    }


    const deletedComment = await Comment.findOneAndDelete({_id : commentId, userId})
    if(!deletedComment){
        throw new customError('Comment not found or not authorized', 400)
    }
    res.status(200).json({
        success : true,
        message : 'Comment deleted successfully!',
        deletedComment
    })
})