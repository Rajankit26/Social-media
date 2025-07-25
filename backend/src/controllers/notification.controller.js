import User from "../models/user.schema.js"
import asyncHandler from "../service/asyncHandler.js"
import customError from "../service/customError.js"
import Notification from "../models/notification.schema.js"
import mongoose from "mongoose"

export const getNotification = asyncHandler(async(req, res) => 
{
    const notifications = await Notification.find({recieverId : req.user._id}).sort({createdAt : -1});

    res.status(200).json(
        {
            success : true,
            notifications
        }
    )
})

export const markAsRead = asyncHandler(async(req, res) => {
    const { notificationId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(notificationId))
    {
        throw new customError('Invalid notificationId', 400);
    }

    const notification = await Notification.findById(notificationId);
    if(!notification)throw new customError('notification not found');
    await Notification.findByIdAndUpdate( notificationId, {isRead : true});
    res.status(200).json(
        { success: true,
         message: 'Marked as read'
        });
})

export const markAllAsRead = asyncHandler(async(req, res) => {
    const notification = await Notification.find({recieverId : req.user._id});
    if(!notification.length)throw new customError('Notification not found', 400);
    await Notification.updateMany( {recieverId : req.user._id}, {isRead : true});
    res.status(200).json(
        { success: true,
         message: 'All marked as read'
        });
})

export const deleteNotification = asyncHandler(async(req, res) => {
    const { notificationId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(notificationId))
    {
        throw new customError('Invalid notificationId', 400);
    }

    const notification = await Notification.findById(notificationId);
    
    await Notification.findOneAndDelete( {_id : notificationId}, {recieverId : req.user._id});
    if(!notification)throw new customError('notification not found or not authorized', 400);
    res.status(200).json(
        { success: true,
         message: 'Deleted sucessfully'
        });
})