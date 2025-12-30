import jwt from 'jsonwebtoken'

async function authFoodPartnermiddleware(req, res,next){
  const token = req.cookies.token
  if(!token){
    return res.status(401).render("clientside", {
  statusCode: 401,
  message: "Invalid Token"
});
  }
  try {
    const decoded =  jwt.verify(token, process.env.PARTNER_JWT_KEY)
    req.foodpartner = { id:decoded.userId }
    next()
  } catch (error) {
    return res.status(500).render("serverside",{
      statusCode: 500,
      message: "Something broke on our end."
    })
  }
}

export default authFoodPartnermiddleware