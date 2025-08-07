import express from 'express'
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointments, cancelAppointment, paymentRazorPay, verifyRazorPay } from '../controllers/userController.js'
import authUser from '../middleware/authUser.js'
import upload from '../middleware/multer.js'

const userRouter = express.Router()

userRouter.post('/register'          , registerUser               )
userRouter.post('/login'             , loginUser                  )
userRouter.get('/get-profile'        , authUser, getProfile       )
userRouter.post('/book-appointment'  , authUser, bookAppointment  )
userRouter.get('/appointments'       , authUser, listAppointments )
userRouter.post('/cancel-appointment', authUser, cancelAppointment)
userRouter.post('/payment-razorpay'  , authUser, paymentRazorPay  )
userRouter.post('/update-profile'    , authUser, upload.single('image'), updateProfile)
userRouter.post('/verify-razorpay'   , authUser, verifyRazorPay)


export default userRouter