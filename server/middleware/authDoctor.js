import jwt from 'jsonwebtoken'

const authDoctor = (req, res, next) => {
  try {
    const token = req.headers.doctortoken   
    
    if (!token) return res.status(401).json({ success: false, message: 'No token' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.doctorId = decoded.id
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }
}

export default authDoctor
