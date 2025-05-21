import { Router } from "express";
import {addComment, getAllComments, getComment, editComment, deleteComment} from '../controllers/comment.controller.js'
import { verifyToken } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
const router = Router()

router.post('/:postId', verifyToken, upload.array('files', 3), addComment)
router.get('/:postId', getAllComments)
router.get('/:postId', verifyToken, getComment)
router.patch('/:postId/update/:commentId', verifyToken, editComment)
router.delete('/delete/:commentId', verifyToken, deleteComment)
export default router