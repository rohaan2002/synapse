import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie =(userId, res)=>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn: "15d"
    });
// here a jwt token is made, it takes userId as a payload (so that this token can be identified as only for userId)
// then its token is encoded using JWT_SECRET
// -------------------------------------
// *************whole process is:************* 
// Client sends req res object when SIGNUP or LOGIN, userId is fetched from req, and use as a payload use krke jwt token bnane bhej dete h
// as a cookie wpis aajata h token bankke, (cookieparser se access hojayega res.cookie m)
// NOW CLIENT HAS THAT TOKEN
// ab jab bhi client bhejega kch esa kam ki req jisme auth ki jrurt ho like updateProfile,to client req m token sath bhejega,
//  to phle jwt decode krega token and see if valid /not expired and same userId
// if validated return success and update is allowed, else throws ERROR
// ---------------------------------------------
// wo jo res object generateTokenAndSetCookie ke args m dala tha, joki us kisi signup request ke response m bheja jayega, us res object se cookie attack hogi ese :
    res.cookie("jwt", token, {
        maxAge: 15* 24* 60 * 60 *1000, // in ms
        httpOnly: true, //prevenst XSS attacks
        sameSite: "strict",
        secure : process.env.NODE_ENV != "development"
    })

}

export default generateTokenAndSetCookie