import mongoose from 'mongoose'
import Post from '../models/post.schema.js'
import asyncHandler from '../service/asyncHandler.js'
import customError from '../service/customError.js'
import cloudinary from '../config/cloudinary.js'

export const createPost = asyncHandler(async(req, res) => {
    
    const userId = req.user._id
    const files = req.files;
    const { text } = req.body;

    const content = []

    if(files && files.length > 0){
        files.forEach( (file) => {
            let mediaType = 'document';

            if(file.mimetype.startsWith('image'))mediaType= 'image';
            else if(file.mimetype.startsWith('video'))mediaType = 'video';

            if(file.path && file.filename){
                content.push(
                {
                    type : mediaType,
                    url : file.path,
                    public_id : file.filename
                }
            );
            }
            
        });
    }

    if(text && typeof text === 'string' && text.trim() != ''){
        content.push(
            {
                type : 'text',
                text : text.trim()
            }
        )
    }

    if(!content || !Array.isArray(content) || content.length === 0){
        throw new customError('Post content is required and should be an array', 400)
    }
    
    const userPost = await Post.create({userId, content})
    res.status(201).json({
        success : true,
        message : 'Post created successfully',
        post : userPost
    })
})

export const updatePost = asyncHandler(async(req, res) => {
    const {postId} = req.params
    const userId = req.user._id
    const files = req.files
    const { text, removeIds } = req.body

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
    
    // Remove content based on provided public_ids
    // The server recives removeIds as (string):- '["id1", "id2"]'
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
            post.content = post.content.filter( (item) => {
                return !parsedRemoveIds.includes(item.public_id)
            })
        }
    }

    if(files && files.length > 0){
        files.forEach( (file) => {
            let mediaType = 'document'
            if(file.mimetype.startsWith('image'))mediaType = 'image'
            else if(file.mimetype.startsWith('video'))mediaType = 'video'

            if(file.path && file.filename){
                post.content.push(
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
        post.content.push({
            type : 'text',
            text : text.trim()
        })
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

    // Delete associated media frim Cloudinary
    for(const item of post.content){
        if(item.public_id){
            await cloudinary.uploader.destroy(item.public_id);
        }
    }

    await Post.deleteOne({_id : postId});
    res.status(200).json({
        success : true,
        message : 'Post deleted successfully'
    })
})