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
                url :{
                    type :  String
                },
                text : {
                    type :  String
                }
            }
        ]
    },
    {
        timestamps : true
    }
)

export default mongoose.model('Post', postSchema)