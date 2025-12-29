import jwt from 'jsonwebtoken'


export async function authUsermiddleware(req, res, next){
  try {
    const token = req.cookies.token
    if(!token){
      return res.status(401).render("clientside", {
              statusCode: 401,
              message: "Invalid Token"})
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    req.user = {id:decoded.userId}
    next()
  } catch (error) {
    console.error(error)
    return res.status(500).render("serverside",{
      statusCode: 500,
      message: "Something broke on our end."
    })
  }
}