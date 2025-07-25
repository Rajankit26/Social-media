import { Router } from "express";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";
import {likePost, dislikePost, getLikes} from '../controllers/like.controller.js'

const router = Router()

router.post('/:postId', verifyAccessToken, likePost)
router.patch('/:postId', verifyAccessToken, dislikePost)
router.get('/:postId', getLikes)
export default router