import mongoose from "mongoose"

const postSchema = new mongoose.Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required : true,
            index : true
        },
        content : [
            {
                type : {
                    type : String,
                    enum : ['text', 'image', 'video', 'document'],
                    required : true
                },
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

export default mongoose.model('Post', postSchema)