const express=require("express")
const auth=require("../middleware/auth")
const permit=require("../middleware/rbac")
const BlogModel=require("../models/blog.model")
const jwt=require("jsonwebtoken")
const blogroute=express.Router()



blogroute.get("/",auth,async(req,res)=>{
    const token=req.cookies.accesstoken
    const decoded=jwt.verify(token,"mayki")
    const blogs=await BlogModel.find({usermail:decoded.usermail})
    res.status(200).send(blogs)
})


blogroute.post("/post",auth,permit(["User"]),async(req,res)=>{
    try {
        const blog=new BlogModel(req.body)
        await blog.save()
        res.status(200).send(blog)
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})


blogroute.patch("/patch/:id",auth,permit(["User"]),async(req,res)=>{
    const {id}=req.params
    const data=req.body
    const token=req.cookies.accesstoken
    const decoded=jwt.verify(token,"mayki")
    {
        try {
            const blog=await BlogModel.findById({_id:id})
            if(blog.usermail!=decoded.usermail)
            {
                return res.status(400).send({"msg":"not authorised"})

            }
            const updateblog=await BlogModel.findByIdAndUpdate({_id:id},data)
            res.status(200).send(updateblog)
            
        } catch (error) {
            res.status(400).send({msg:error.message})
        }
    }

})

blogroute.delete("/delete/:id",auth,permit(["User"]),async(req,res)=>{
    const {id}=req.params
    const token=req.cookies.accesstoken
    const decoded=jwt.verify(token,"mayki")
    try {

        const blog=await BlogModel.findById({_id:id})
        if(blog.usermail!=decoded.usermail)
        {
            return res.status(400).send({"msg":"not authorised"})

        }
        const updateblog=await BlogModel.findByIdAndDelete({_id:id})
        res.status(200).send({msg:"blog has been delete"})
        
    } catch (error) {
        res.status(400).send({msg:error.message})
    }
})



blogroute.delete("/deletebymoderator/:id",auth,permit(["Moderator"]),async (req,res)=>{
    const {id}=req.params
    try {
        const delblog=await BlogModel.findByIdAndDelete({_id:id})
        res.status(200).send({msg:"blog deleted"})
    } catch (error) {
        res.status(400).send({msg:error.message})
    }
} )


module.exports=blogroute