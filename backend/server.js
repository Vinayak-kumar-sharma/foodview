// server start
const server = require('./src/app.js')
const {connectDb,pool} = require('./src/db/db.js')
connectDb();
server.listen(3000,()=>{
  console.log("server is running on port localhost:3000")
})