const BlacklistModel=require("../models/blacklist.model")
const jwt=require("jsonwebtoken")
const auth=async(req,res,next)=>{
    const token=req.cookies.accesstoken
    if(token)
    {
        const blacklisted=await BlacklistModel.findOne({token})
        if(blacklisted)
        {
            return res.status(400).send({msg:"you have to login again..!!"})
        }
        jwt.verify(token,"mayki",async function (err,decoded){
            if(err)
            {
                if(err.message=="jwt expired")
                {
                    const refreshtoken=req.cookies.refreshtoken
                    const blacklistedrefresh= await BlacklistModel.findOne({token:refreshtoken})
                    if(blacklistedrefresh)
                    {
                        return res.status(400).send({msg:"you have to login again...!"})
                    }
                    jwt.verify(refreshtoken,"mayki123",function (err,decoded){
                        if(decoded)
                        {
                            const naccesstoken=jwt.sign({email:decoded.email,role:decoded.role},"mayki",{expiresIn:"1m"})
                            res.cookie("accesstoken",naccesstoken,{maxAge:1000*60*5})
                            req.role=decoded.role
                            req.body.useremail=decoded.email
                            next()

                        }
                        else
                        {
                            return res.status(400).send({"msg":"you have to login again"})
                        }
                    })
                }
                else
                {
                    return res.status(400).send({"msg":"you have to login again"})
                }
            }
            else
            {
                req.role=decoded.role
                req.body.useremail=decoded.email
                next()
            }
        })
    }
    else
    {
        res.status(400).send({msg:"you have to login first"})
    }
   
}

module.exports=auth