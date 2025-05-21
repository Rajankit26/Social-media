import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required : true,
            index : true
        },
        postId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Post',
            required : true,
            index : true
        },
        content : [
            {
                type : {type : String, enum : ['text', 'image', 'gif','video'], required : true},
                url : String,
                public_id : String,
                text : String
            }
        ]
    },
    {
        timestamps : true
    }
)
export default mongoose.model('Comment', commentSchema)