const jwt =require('jsonwebtoken')

const isLoggedIn=(req,res,next)=>{
    try{
        const { authorization } = req.headers;
        const user = jwt.verify(authorization,process.env.jwt_secret_key)
        req.user = user;
        next();
    }catch(error){
        console.log(error)
        res.status(401).json({
            message: "Unauthorized - You've not logged in! Please login",
        });
    }
}
module.exports=isLoggedIn