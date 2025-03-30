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
        content : {
            type : String,
            required : true,
            trim : true
        }
    },
    {
        timestamps : true
    }
)
export default mongoose.model('Comment', commentSchema)