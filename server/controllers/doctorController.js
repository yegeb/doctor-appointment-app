import doctorModel from "../models/doctorModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import appointmentModel from "../models/appointmentModel.js"


const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body

        const docData = await doctorModel.findById(docId)

        await doctorModel.findByIdAndUpdate(docId, {available: !docData.available})
        res.json({success: true, message: 'Availability Changed'})
    }

    catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])

        res.json({success: true, doctors})
    } 
    catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// API for doctor login
const doctorLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const doctor = await doctorModel.findOne({email})

        if (!doctor) {
           return res.json({success: false, message: 'Doctor does not exist!'}) 
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {
            const doctorToken = jwt.sign({id:doctor._id}, process.env.JWT_SECRET)
            res.json({success: true, doctorToken})
        }

        else {
            res.json({success: false, message: 'Password is not correct!'})
        }
    } 
    
    catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})  
    }
}

// API to get doctor appointments for doctor panel
const doctorAppointments = async (req, res) => {
    try {
        const docId = req.doctorId
        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })
    } 
    
    catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})  
    }
}

// API to mark appointment completed for doctor panel
const doctorAppointmentComplete = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const docId = req.doctorId
        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId.toString() === docId.toString()) {
            await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted: true})
            return res.json({success: true, message: 'Appointment has been completed.'})
        }

        else{
            return res.json({success: false, message: 'Mark failed.'})

        }
    } 

    catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})  
    }
}

// API to cancel appointment completed for doctor panel
const doctorAppointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const docId = req.doctorId
        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId.toString() === docId.toString()) {
            await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})
            return res.json({success: true, message: 'Appointment has been cancelled.'})
        }

        else{
            return res.json({success: false, message: 'Cancellation has been failed.'})

        }
    } 

    catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})  
    }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {
        const docId = req.doctorId

        const appointments = await appointmentModel.find({docId})

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if(!patients.includes(item.userId)){
                patients.push(item.userId)
            }   
        })

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({success: true, dashData   })
    } 
    
    catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})   
    }
}

// API to get doctor profile for Doctor Panel
const doctorProfile = async (req, res) => {
    try {
       const docId = req.doctorId
       const profileData = await doctorModel.findById(docId).select('-password')
       
       res.json({success: true, profileData})

    } 
    
    catch (error) {
        console.log(error)
        res.json({success: false, message: error.message}) 
    }
}

// API to update doctor profile data from Doctor Panel 
const updateDoctorProfile = async (req, res) => {
    try {
        const {fee, address, available } = req.body
        const docId = req.doctorId

        await doctorModel.findByIdAndUpdate(docId, {fee, address, available})

        res.json({success: true, message: 'Profile has been updated.'})
    } 

    catch (error) {
        console.log(error)
        res.json({success: false, message: error.message}) 
    }
}

export {changeAvailability, doctorList, doctorLogin, doctorAppointments, doctorAppointmentComplete, doctorAppointmentCancel, doctorDashboard, doctorProfile, updateDoctorProfile }