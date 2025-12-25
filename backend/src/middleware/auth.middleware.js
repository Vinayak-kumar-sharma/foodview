import jwt from 'jsonwebtoken'

async function authFoodPartnermiddleware(req, res,next){
  const token = req.cookies.token
  if(!token){
    return res.status(401).json({
      message:"Please login first"
    })
  }
  try {
    const decoded =  jwt.verify(token, process.env.JWT_KEY)
    req.foodpartner = {
      id:decoded.userId
    }
    next()
  } catch (error) {
    return res.status(401).json({message:"Invalid token or expires"})
  }
}

export default authFoodPartnermiddleware