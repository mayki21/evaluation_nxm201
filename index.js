const express=require("express")
const connection=require("./connections/db")
const userroute=require("./routes/user.route")
const blogroute=require("./routes/blog.route")
const cookieparser=require("cookie-parser")
require("dotenv").config()
const app=express()

app.use(express.json())
app.use(cookieparser())


app.use("/user",userroute)
app.use("/blog",blogroute)



app.listen(process.env.port,async ()=>{
    try {
        await connection;
        console.log("connected to DB")
    } catch (error) {
        console.log("not connected to DB")
    }
})