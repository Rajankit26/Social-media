import { Router } from "express";
import {signup, login, logout, getUserProfile, updateProfile} from '../controllers/auth.controller.js'
import { verifyToken } from "../middlewares/auth.middleware.js";
const router = Router()

router.post('/signup',signup)
router.post('/login', login)
router.get('/logout', logout)
router.get('/profile', verifyToken, getUserProfile)
router.patch('/updateProfile', verifyToken, updateProfile)
export default router