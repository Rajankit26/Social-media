import JWT from "jsonwebtoken"
import dotenv from 'dotenv'

dotenv.config()

export const generateAccessToken = (payload) =>{
    return JWT.sign(payload,process.env.ACCESS_TOKEN_SECRET,{
       expiresIn : process.env.ACCESS_TOKEN_EXPIRES_IN || "10min"
    })
}

export const generateRefreshToken = (payload) =>{
    return JWT.sign(payload,process.env.REFRESH_TOKEN_SECRET,{
       expiresIn : process.env.REFRESH_TOKEN_EXPIRES_IN || "7d"
    })
}

export const verifyJWT = (token, secretKey) =>{
    try {
        return JWT.verify(token, secretKey)
    } catch (error) {
        console.error(`JWT verification failed : ${error.name} - ${error.message}`)
        return null;
    }
}