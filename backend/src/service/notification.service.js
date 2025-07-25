import Notification from "../models/notification.schema.js"
import customError from "./customError.js"
import { ALLOWED_NOTIFICATION_TYPES } from "../utils/notificationTypes.js";

export const createNotification = async(
    {
        senderId, 
        recieverId, 
        type,
        postId = null,
        commentId = null,
        messageContent
    }
) =>
{
    if(!senderId || !recieverId || !type || !messageContent)
    {
        throw new customError("These fields are required", 404);
    }
    const allowedNotificationTypes = Object.values(ALLOWED_NOTIFICATION_TYPES);
    if(!allowedNotificationTypes.includes(type))
    {
        throw new customError("Invalid Notification type", 400);
    }

    if(senderId.toString() === recieverId.toString())return;

    const notification = await Notification.create(
        {
            senderId, 
            recieverId, 
            postId,
            commentId,
            messageContent,
            type,
            isRead: false
        }
    )

    return notification;
};
