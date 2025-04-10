import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {likePost, dislikePost, getLikes} from '../controllers/like.controller.js'

const router = Router()

router.post('/:postId', verifyToken, likePost)
router.patch('/:postId', verifyToken, dislikePost)
router.get('/:postId', getLikes)
export default router