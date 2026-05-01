import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const protect = async (req,res,next) => {
    try{
        const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
        if(!token){
            return res.status(401).json({message: 'User not logged in, token not found'});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await pool.query('SELECT id, name, email, password FROM users WHERE id = $1',[decoded.id])
        if(user.rowCount === 0){
            return res.status(401).json({message: "Not authorized, user not found"});
        }
        req.user = user.rows[0];
        next();
    }
    catch(error){
        console.log("An unexpected error occured: ",error)
        return res.status(401).json({message: 'Not authorized, token malfunction'})
    }
}