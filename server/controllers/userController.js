import validator            from 'validator'
import bcrypt               from 'bcrypt'
import jwt                  from 'jsonwebtoken'
import razorpay             from 'razorpay'
import { v2 as cloudinary } from 'cloudinary' 
import userModel            from '../models/userModel.js'   
import doctorModel          from '../models/doctorModel.js'
import appointmentModel     from '../models/appointmentModel.js'


// API to register user
const registerUser = async (req, res) => {
    try {
       const { name, email, password } = req.body
       
    if (!name || !password || !email) {
        return res.json({success: false, message: "Missing Details!"})
    }

    // Validating email format
    if (!validator.isEmail(email)) {
        return res.json({success: false, message: "Enter a Valid Email!"})
    } 

    // [NOTE]: CHANGE THE PASSWORD SECURITY CRITERIA !!!
    if (password.length < 8) {
        return res.json({success: false, message: "Enter a Strong Password!"})
    }

    // Hash user passwords
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()  
        const userToken = jwt.sign({id: user._id}, process.env.JWT_SECRET)

        res.json({success: true, userToken})


    } 
    catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
} 

// API for user login

const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body
        const user = await userModel.findOne({email}) 

        if (!user) {
            return res.json({success: false, message: 'User does not exist!'}) 
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const userToken = jwt.sign({id:user._id}, process.env.JWT_SECRET)
            res.json({success: true, userToken})
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

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    // Use req.userId set by authUser
    const userData = await userModel.findById(req.userId).select('-password')
    
    if (!userData) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.json({ success: true, userData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message }) 
  }
}


// API to update user profile data
const updateProfile = async (req, res) => {
    try {
        
        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file 

        if (!name || !phone || !dob || !gender) {
            return res.json({success: false, message: 'Fill out all of the areas'})
        }

        await userModel.findByIdAndUpdate(userId, {name, phone, address:JSON.parse(address), dob, gender})

        if (imageFile) {
            // Upload image to Cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: 'image'})
            const imageURL    = imageUpload.secure_url
            
            await userModel.findByIdAndUpdate(userId, {image: imageURL})    
        }

        res.json({success: true, message: 'Profile Updated!'})

    }

    catch (error) {
        console.log(error)
        res.json({success: false, message: error.message}) 
    }
}

// API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
    const userId = req.userId; 

    // 1. Fetch doctor
    const docData = await doctorModel.findById(docId).select('-password');
    if (!docData) return res.json({ success: false, message: 'Doctor not found' });
    if (!docData.available) return res.json({ success: false, message: 'Doctor not available' });

    // 2. Check slot
    let slots_booked = docData.slots_booked || {};
    if (slots_booked[slotDate]?.includes(slotTime)) {
      return res.json({ success: false, message: 'Slot not available' });
    }
    slots_booked[slotDate] = [...(slots_booked[slotDate] || []), slotTime];

    // 3. Fetch user
    const user = await userModel.findById(userId).select('-password').lean();
    if (!user) return res.json({ success: false, message: 'User not found or token invalid' });

    // 4. Create appointment object
    const appointmentData = {
      userId: userId.toString(),
      docId: docId.toString(),
      userData: user,
      docData: {
        ...docData.toObject(),
        slots_booked: undefined,
      },
      slotDate,
      slotTime,
      amount: docData.fee,
      date: Date.now(),
      payment: false,
      cancelled: false,
    };

    console.log('Appointment to save:', appointmentData); // Debug

    // 5. Save appointment
    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // 6. Update doctor slots
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: 'Appointment has been booked' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}


// API to get user appointments for client my-appointments page
const listAppointments = async (req, res) => {
  try {
    const userId = req.userId; 
    const appointments = await appointmentModel.find({ userId }).sort({ date: -1 });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// API to cancel appointment 
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.userId; // ✅ Use token-based auth

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Verify user for the appointment
    if (appointmentData.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized action' });
    }

    if (appointmentData.cancelled) {
      return res.json({ success: false, message: 'Appointment already cancelled' });
    }

    // Mark as cancelled
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    // Release doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const docData = await doctorModel.findById(docId);

    if (docData && docData.slots_booked[slotDate]) {
      docData.slots_booked[slotDate] = docData.slots_booked[slotDate].filter(
        (time) => time !== slotTime
      );
      await docData.save();
    }

    res.json({ success: true, message: 'Appointment has been cancelled' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}


let razorpayIns = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayIns = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
} else {
  console.warn('⚠️ Razorpay keys not found. Payment features are disabled.');
}

// API to make payment for the appointments using RazorPay
const paymentRazorPay = async (req, res) => {

    try {
        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({success: false, message: 'Appointment Cancelled or not Found'})
        }

        // Creating options for RazorPay payment
        const options = {
            amount:   appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt:  appointmentId
        }

        // Creation of an order
        const order = await razorpayIns.orders.create(options)

        res.json({success: true, order})
    } 
    
    catch (error) {
        console.log(error)
        res.json({success: false, message: error.message}) 
    }

}

// API to verify payment of RazorPay
const verifyRazorPay = async (req, res) => {
    try {
        const {razorpay_order_id} = req.body
        const orderInfo = await razorpayIns.orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {payment: true})
            res.json({success: true, message: 'Payment has been successfull'})
        }

        else {
           res.json({success: false, message: 'Payment has been failed'}) 
        }

    } 
    
    catch (error) {
        console.log(error)
        res.json({success: false, message: error.message}) 
    }
}


export {registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointments, cancelAppointment, paymentRazorPay, verifyRazorPay}