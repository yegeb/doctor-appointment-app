import jwt from 'jsonwebtoken'

// Admin Authentication Middleware
const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers
        if (!atoken) {
            return res.json({success:false, message:"Admin token is required"})
        }
        const decoded_atoken = jwt.verify(atoken, process.env.JWT_SECRET)

        if(decoded_atoken.email !== process.env.ADMIN_EMAIL){
            return res.json({success:false, message:"Unauthorized access"})
        }

        next()

    }
    catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

export default authAdmin