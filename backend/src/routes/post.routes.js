import { Router } from "express";
import {createPost, updatePost, getUserPost, getPost, deletePost} from '../controllers/post.controller.js'
import { verifyAccessToken } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
const router = Router()

router.post('/createPost', verifyAccessToken, upload.array('files', 10),
    createPost)
router.patch('/updatePost/:postId', verifyAccessToken, upload.array('files', 10), updatePost)
router.get('/post', verifyAccessToken,getUserPost)
router.get('/post/:postId', verifyAccessToken, getPost)
router.delete('/post/:postId', verifyAccessToken, deletePost)
export default router