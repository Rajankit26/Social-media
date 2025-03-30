import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
    {
        userName : {
            type : String,
            minLength : [4,'Username should be of at least 4 chars'],
            maxLength : [10,'Username should be less than 10 chars'],
            required : true,
            unique : true,
            trim : true
        },
        email : {
            type : String,
            required : [true, 'email is required'],
            unique : true
        },
        password :{
            type : String,
            minLength : [8,'password should be atleast eight chars'],
            maxLength :[10,'password should be less than 10 chars'],
            required : [true,"password is required"],
            select : false
        },
        bio : String,
        profile_picture : [
            {
                secure_url :{
                    type : String,
                    required : true,
                }
            }
        ],
        profile_cover :[
            {
                secure_url : String,
            }
        ],
        gender : {
            type : String,
            enum :["Female", "Male", "Others"]
        }

    },
    {timestamps : true}
)

userSchema.pre("save", async function(next){
    if(!this.isModified("password"))return next()
    this.password = await bcrypt.hash(this.password,8)
    next()
})

export default mongoose.model('User', userSchema);