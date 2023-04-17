const mongoose=require("mongoose")


const Blogschema=mongoose.Schema({
    title:String,
    subject:String,
    body:String,
    useremail:String
   
})

const BlogModel=mongoose.model("Blog",Blogschema)
module.exports=BlogModel