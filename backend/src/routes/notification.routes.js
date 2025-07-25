import { Router } from "express";
import { getNotification, markAllAsRead, markAsRead, deleteNotification } from "../controllers/notification.controller";
import { verifyAccessToken } from "../middlewares/auth.middleware";
const router = Router();

router.get('/', verifyAccessToken, getNotification);
router.patch('/:notificationId/read', verifyAccessToken, markAsRead);
router.patch('/readAll', verifyAccessToken, markAllAsRead);
router.delete('/:notificationId', verifyAccessToken, deleteNotification);
export default router;

