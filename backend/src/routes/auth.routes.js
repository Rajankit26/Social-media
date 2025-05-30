import { Router } from "express";
import {signup, login, logout, getUserProfile, updateProfile, refreshAccessToken} from '../controllers/auth.controller.js'
import { verifyAccessToken } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js"

const router = Router()

router.post('/signup',signup)
router.post('/login', login)
router.get('/refresh-token', refreshAccessToken)
router.get('/logout', logout)
router.get('/profile', verifyAccessToken, getUserProfile)
router.patch('/updateProfile', verifyAccessToken, upload.fields([
    // After upload, the file info is present into req.files
    {
        name : 'profile_picture',
        maxCount : 1
    },
    {
        name : 'profile_cover',
        maxCount : 1
    }
]),
     updateProfile)
export default router