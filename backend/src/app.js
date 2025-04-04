import express from 'express'
import cors from 'cors'
import userRoutes from './routes/auth.routes.js'
import cookieParser from 'cookie-parser'

const app = express()


app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended : true}))
app.get('/',(req,res) =>{
    res.send('Hello from server');
})

app.use('/api/v1/auth', userRoutes)

export default app;