//create Token
const sendToken = (user,roleTask,statusCode,res)=>{
    const token = user.getJWTToken();

    // options for cookies

    const options= {
        expires:new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
    }
    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        user,
        roleTask,
        token,
        message:"Login Successfully"
    })
}
 

module.exports = sendToken