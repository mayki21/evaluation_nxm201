function permit(array)
{
    return(req,res,next)=>{
        if(array.includes(req.role))
        {
            next()
        }
        else
        {
            res.status(400).send({msg:"not authorised route"})
        }
    }
}

module.exports=permit