import validator from 'validator';
import bycrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'

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

        // Validate strong password
        if(password.length < 8) {
            return res.status(400).json({success:false, message: "Password must be at least 8 characters long"});
        }

        // Hash the doctor password
        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password, salt);

        // Upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"});
        const imageURL = imageUpload.secure_url


        const doctorData = {
            name,
            email,
            image:imageURL,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fee,
            address:JSON.parse(address),
            date:Date.now()
        }

        const newDoctor = new doctorModel(doctorData);
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

  } catch (error) {
    console.error("[ERROR] Admin login failed:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export { addDoctor, loginAdmin };