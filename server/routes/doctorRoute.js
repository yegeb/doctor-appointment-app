import express from 'express'
import { doctorList, doctorLogin, doctorAppointments, doctorAppointmentComplete, doctorAppointmentCancel, doctorDashboard, doctorProfile, updateDoctorProfile } from '../controllers/doctorController.js'
import authDoctor from '../middleware/authDoctor.js'

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', doctorLogin)
doctorRouter.get('/appointments', authDoctor, doctorAppointments)
doctorRouter.post('/complete-appointment', authDoctor, doctorAppointmentComplete)
doctorRouter.post('/cancel-appointment', authDoctor, doctorAppointmentCancel)
doctorRouter.get('/dashboard', authDoctor, doctorDashboard)
doctorRouter.get('/profile', authDoctor, doctorProfile)
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile)

export default doctorRouter