import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

// App Config 
const app = express()
const port = process.env.PORT || 4000

// Database Setup
connectDB()

// Cloud Setup for Image & File Uploads
connectCloudinary()

// Global Middlewares
app.use(express.json())
app.use(cors())

// Api Endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

// Launch the Server
app.listen(port, () => console.log("Server Started", port))