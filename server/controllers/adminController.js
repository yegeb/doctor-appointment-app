import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';

// API for adding doctor
const addDoctor = async(req, res) => {

    try{
        const { name, email, password, speciality, degree, experience, about, fee, address } = req.body
        const imageFile = req.file  

        // Check if there's a problem related to image
        if (!imageFile) {
          return res.status(400).json({ success: false, message: "Image file is missing or field name is incorrect (should be 'image')" });
        }


        // Check if all required fields are provided
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fee || !address) {
            return res.status(400).json({success:false, message: "All fields are required"});
        }

        // Validate email format
        if(!validator.isEmail(email) ) {
            return res.status(400).json({success:false, message: "Invalid email format"});
        }

        // [NOTE]: CHANGE THE PASSWORD SECURITY CRITERIA !!!
        if(password.length < 8) {
            return res.status(400).json({success:false, message: "Password must be at least 8 characters long"});
        }

        // Hash the doctor password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"});
        const imageURL = imageUpload.secure_url


        const docData = {
            name,
            email,
            image: imageURL,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fee,
            address:JSON.parse(address),
            date:Date.now()
        }

        const newDoctor = new doctorModel(docData);
        await newDoctor.save();

        res.json({success:true, message:" Doctor Added"});

    } 
    catch(error){
        console.log(error);
        res.json({success: false, message: error.message});
    }

}

// API for Admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.status(200).json({ success: true, token });
    } else {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

  } 
  
  catch (error) {
    console.error("[ERROR] Admin login failed:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
  try{
    const doctors = await doctorModel.find({}).select('-password')
    res.json({success: true, doctors})
  }

  catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// API to get all appointments list
const appointmentAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({})
    res.json({success: true, appointments})
  } 
  
  catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// API to cancel appointments
const adminCancelAppointment = async (req, res) => {
    try {
        const {userId, appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        // Verify user for the appointment
        if (appointmentData.userId.toString() !== userId.toString()) {
          return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})

        // Releasing doctor slot

        const { docId, slotDate, slotTime } = appointmentData

        const docData = await doctorModel.findById(docId)

        let slots_booked = docData.slots_booked

        if (slots_booked[slotDate]) {
          slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
        }

        await doctorModel.findByIdAndUpdate(docId, {slots_booked})

        res.json({success: true, message: "Appointment has been cancelled"})
    } 
    
    catch (error) {
      console.log(error)
      res.json({success: false, message: error.message})  
    }
}

// API to get dashboard data for admin panel
const adminDash = async (req, res) => {
  try {
    const doctors = await doctorModel.find({})
    const users = await userModel.find({})
    const appointments = await appointmentModel.find({})

    const dashData = {
      doctors           : doctors.length,
      appointments      : appointments.length,
      patients          : users.length,
      latestAppointments: [...appointments].reverse().slice(0, 5)
    }

    res.json({success: true, dashData})
  } 
  
  catch (error) {
    console.log(error)
    res.json({success: false, message: error.message}) 
  }
}


export { addDoctor, loginAdmin, allDoctors, appointmentAdmin, adminCancelAppointment, adminDash };