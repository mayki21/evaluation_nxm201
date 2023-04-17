const express=require("express")
const userroute=express.Router()
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const UserModel=require("../models/user.model")
const BlacklistModel=require("../models/blacklist.model")


userroute.post("/register",async (req,res)=>{
    const {name,email,password,role}=req.body
    try {
        const alreadyuser=await UserModel.findOne({email})
        if(alreadyuser)
        {
            return res.status(400).send({msg:"already a user in our Database"})
        }
        bcrypt.hash(password,7,async (err,hash)=>{
            const user=new UserModel({name,email,password:hash,role})
            await user.save()
            res.status(200).send({msg:"registration sucessfully done..!!"})
        })
        
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})



userroute.post("/login",async (req,res)=>{
    const {email,password}=req.body
    try {
        const user=await UserModel.findOne({email})
        if(user)
        {
            bcrypt.compare(password,user.password,function(err,result){
                if(result)
                {
                    const accesstoken=jwt.sign({email,role:user.role},"mayki",{expiresIn:"1m"})
                    const refreshtoken=jwt.sign({email,role:user.role},"mayki123",{expiresIn:"3m"})
                    res.cookie("accesstoken",accesstoken,{maxAge:1000*60*5})
                    res.cookie("refreshtoken",refreshtoken,{maxAge:1000*60*10})
                    res.status(200).send({msg:"login successfully done",accesstoken,refreshtoken})
                }
                else
                {
                    res.status(400).send({msg:"wrong credentials entered, pls check"})
                }
            })
        }
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})


userroute.get("/logout",async (req,res)=>{
    const accesstoken=req.cookies.accesstoken
    const refershtoken=req.cookies.refershtoken
    const accesstokenblack=new BlacklistModel({token:accesstoken})
    await accesstokenblack.save()
    const refreshtokenblack=new BlacklistModel({token:refershtoken})
    await refreshtokenblack.save()
    res.status(200).send({msg:"logout successfullly done...!!"})
})



module.exports=userroute