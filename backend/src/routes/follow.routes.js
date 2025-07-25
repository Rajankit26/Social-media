import { Router } from "express";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";
import {followUser, unfollowUser, getFollowers, followersCount} from '../controllers/follow.controller.js'

const router = Router();
router.post('/:userId1', verifyAccessToken, followUser)
router.patch('/unfollow/:userId1', verifyAccessToken, unfollowUser)
router.get('/followers',verifyAccessToken, getFollowers)
router.get('/followersCount', verifyAccessToken, followersCount)

export default router