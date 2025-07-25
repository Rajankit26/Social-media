import mongoose from "mongoose";
import { ALLOWED_NOTIFICATION_TYPES } from "../utils/notificationTypes";
const notificationSchema = new mongoose.Schema(
    {
        senderId :{
            type : mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required : true,
            index : true,
        },
        recieverId : {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required: true,
            index: true
        },
        type : {
            type : String,
            enum: Object.values(ALLOWED_NOTIFICATION_TYPES),
            required: true
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        },
        commentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        },
        messageContent : {
            type: String,
            required: true,
            trim : true
        },
        isRead :{
            type:  Boolean,
            default: false,
        },

    },
    {
        timestamps: true
    }
)

export default mongoose.model("Notification", notificationSchema);