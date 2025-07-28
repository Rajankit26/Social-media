import express from 'express'
import cors from 'cors'
import userRoutes from './routes/auth.routes.js'
import postRoutes from './routes/post.routes.js'
import commentRoutes from './routes/comment.routes.js'
import likeRoutes from './routes/like.routes.js'
import followRoutes from './routes/follow.routes.js'
import cookieParser from 'cookie-parser'
import notificationRoutes from './routes/notification.routes.js'
import chatBotRoutes from "./routes/chatBot.routes.js"
const app = express()


app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended : true}))
app.get('/',(req,res) =>{
    res.send('Hello from server');
})

app.use('/api/v1/auth/user', userRoutes)
app.use('/api/v1/auth/posts',postRoutes)
app.use('/api/v1/auth/comments', commentRoutes)
app.use('/api/v1/auth/likes', likeRoutes)
app.use('/api/v1/auth/follow', followRoutes)
app.use('/api/v1/auth/notifications', notificationRoutes);

app.use('/api/v1/chatboat', chatBotRoutes);
export default app;