import { Router } from "express";
import {createPost, updatePost, getUserPost, getPost, deletePost} from '../controllers/post.controller.js'
import { verifyToken } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
const router = Router()

router.post('/createPost', verifyToken, upload.array('files', 10),
    createPost)
router.patch('/updatePost/:postId', verifyToken, upload.array('files', 10), updatePost)
router.get('/post', verifyToken,getUserPost)
router.get('/post/:postId', verifyToken, getPost)
router.delete('/post/:postId', verifyToken, deletePost)
export default router