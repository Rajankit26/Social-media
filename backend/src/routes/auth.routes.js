import { Router } from "express";
import {signup, login, logout, getUserProfile, updateProfile} from '../controllers/auth.controller.js'
import { verifyToken } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js"

const router = Router()

router.post('/signup',signup)
router.post('/login', login)
router.get('/logout', logout)
router.get('/profile', verifyToken, getUserProfile)
router.patch('/updateProfile', verifyToken, upload.fields([
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