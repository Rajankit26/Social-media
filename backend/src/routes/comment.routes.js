import { Router } from "express";
import {addComment, getAllComments, getComment, editComment, deleteComment} from '../controllers/comment.controller.js'
import { verifyAccessToken } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
const router = Router()

router.post('/:postId', verifyAccessToken, upload.array('files', 3), addComment)
router.get('/:postId', getAllComments)
router.get('/:postId', verifyAccessToken, getComment)
router.patch('/:postId/update/:commentId', verifyAccessToken,upload.array('files', 3), editComment)
router.delete('/delete/:commentId', verifyAccessToken, deleteComment)
export default router