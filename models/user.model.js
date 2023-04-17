const mongoose=require("mongoose")


const Userschema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:{
        type:String,
        default:"User",
        enum:["Moderator","User"]
    }
})

const UserModel=mongoose.model("User",Userschema)
module.exports=UserModel