import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const connectToDb = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('DB connected successfully')
    } catch (error) {
        console.error(`MONGO DB connection error : ${error.message}`)
        process.exit(1)
    }
}

export default connectToDb;