import mongoose from 'mongoose'
import Comment from '../models/comment.schema.js'
import Post from '../models/post.schema.js'
import asyncHandler from '../service/asyncHandler.js'
import customError from '../service/customError.js'

export const addComment = asyncHandler(async(req, res) =>{
    const {postId} = req.params
    const files = req.files
    const { text } = req.body;
    const userId = req.user._id

    if(!mongoose.Types.ObjectId.isValid(postId)){
        throw new customError('Invalid postId', 400)
    }

    const post = await Post.findById(postId)
    if(!post){
        throw new customError('Post does not exist', 400)
    }

    const commentMedia = [];
    if(files && files.length > 0){
        files.forEach((file) => {
            let mediaType = 'text'
            if(file.mimetype.startsWith('image'))mediaType = 'image'
            else if(file.mimetype.startsWith('video'))mediaType = 'video'
            else if(file.mimetype.includes('image/gif'))mediaType = 'gif'

            if(file.path && file.filename){
                commentMedia.push({
                    type : mediaType,
                    url : file.path,
                    public_id : file.filename
                })
            }
        });
    }

    if(text && typeof text === 'string' && text.trim() != ""){
        commentMedia.push({
            type : "text",
            text : text.trim()
        })
    }
    if(!commentMedia || !Array.isArray(commentMedia) || commentMedia.length === 0){
        throw new customError("Comment can't be empty", 400)
    }
    const comments = await Comment.create({
        userId,
        postId, 
        content : commentMedia
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
    const {postId, commentId} = req.params
    const userId = req.user._id
     const files = req.files
    const { text, removeIds } = req.body

    if(!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(commentId)){
        throw new customError('Invalid postId or commentId', 400)
    }

    const post = await Post.findById(postId)
    const comment = await Comment.findById(commentId)
    if(!post){
        throw new customError('Post not found', 400)
    }
    if(!comment){
        throw new customError('Comment not found', 400)
    }
    if(comment.userId.toString() != userId.toString()){
            throw new customError('You can only update your own comment,unauthorized access!', 400);
        }
    let parsedRemoveIds = [];
    if(removeIds){
        try {
            parsedRemoveIds = JSON.parse(removeIds); //["id1", "id2"] 
        } catch (error) {
            throw new customError('Invalid format for removeIds', 400)
        }

        if(Array.isArray(parsedRemoveIds)){
            for(const public_id of parsedRemoveIds){
                // Remove from cloudinary
                await cloudinary.uploader.destroy(public_id)
            }

            // Remove from DB
            comment.content = comment.content.filter( (item) => {
                return !parsedRemoveIds.includes(item.public_id)
            })
        }
    }

    if(files && files.length > 0){
        files.forEach( (file) => {
            let mediaType = 'text'
            if(file.mimetype.startsWith('image')){
                mediaType = file.mimetype === 'image/gif' ? 'gif' : 'image';
            }
            else if(file.mimetype.startsWith('video'))mediaType = 'video'

            if(file.path && file.filename){
                comment.content.push(
                    {
                        type : mediaType,
                        url : file.path,
                        public_id : file.filename
                    }
                );
            };
        });
    };

    if(text && typeof text === 'string' && text.trim() != ''){
        comment.content.push({
            type : 'text',
            text : text.trim()
        })
    }
    
    if (!comment.content || comment.content.length === 0) {
    throw new customError("Comment can't be empty after update", 400);
}
    await comment.save()

    res.status(200).json({
        success : true,
        message : 'Comment updated successfully',
        editedComment : comment
    })
})

export const deleteComment = asyncHandler(async(req, res) =>{
    const {commentId} = req.params
    const userId = req.user._id

    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new customError('Invalid commentId', 400)
    }

    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new customError('Comment not found',400)
    }

    if(comment.userId.toString() != userId.toString()){
        throw new customError('You are not allowed to delete the comment, unauthorised access', 400)
    }

     for(const item of comment.content){
            if(item.public_id){
                await cloudinary.uploader.destroy(item.public_id);
            }
        }
    await Comment.deleteOne({_id : commentId});
    res.status(200).json({
        success : true,
        message : 'Comment deleted successfully!'
    })
})