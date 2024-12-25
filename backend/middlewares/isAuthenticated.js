import jwt from "jsonwebtoken";
export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.send(401).json({
                success:false,
                message:'User is not authenticated'
            })
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY)
        if (!decode) {
            return res.send(401).json({
                success:false,
                message:'Invalid'
            })
        
        req.id = decode.userid;
        next();
        }
    } catch (error) {
        console.log(error);
        
    }
}

export default isAuthenticated;