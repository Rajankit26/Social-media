import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {followUser, unfollowUser, getFollowers, followersCount} from '../controllers/follow.controller.js'

const router = Router();
router.post('/:userId1', verifyToken, followUser)
router.patch('/unfollow/:userId1', verifyToken, unfollowUser)
router.get('/followers',verifyToken, getFollowers)
router.get('/followersCount', verifyToken, followersCount)

export default router