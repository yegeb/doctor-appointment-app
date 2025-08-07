import jwt from 'jsonwebtoken'

const authUser = (req, res, next) => {
  try {
    const token = req.headers.usertoken // lowercase in frontend
    
    if (!token) return res.status(401).json({ success: false, message: 'No token' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }
}

export default authUser
