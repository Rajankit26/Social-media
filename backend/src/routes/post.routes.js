import { Router } from "express";
import {createPost, updatePost, getUserPost, getPost, deletePost} from '../controllers/post.controller.js'
import { verifyToken } from "../middlewares/auth.middleware.js";
const router = Router()

router.post('/createPost', verifyToken, createPost)
router.patch('/updatePost/:postId', verifyToken, updatePost)
router.get('/post', verifyToken,getUserPost)
router.get('/post/:postId', verifyToken, getPost)
router.delete('/post/:postId', verifyToken, deletePost)
export default router