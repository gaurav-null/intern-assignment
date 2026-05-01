import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db';

const router = express.Router();
const cookieOption = {
    httpOnly: true,
    secure: process.env.NODE_ENV,
    sameSite: true,
    maxAge: 30*24*60*60*1000
}

const genrateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: '30d',
    });
}

router.post('/register' , async (req,rea) => {
    const {username, email, password} = req.body;
    if (!username || !email || !password){
        res.status(400).json({message: 'please fill all the required fields'})
    }
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (userExits.rows.length>0){
        res.status(400).json({message: 'User Already Exits'}) 
    }
    const hashedPassword = await bcrypt.hash(password, 10); 

    const newUser = await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) returning *', [username, email, hashedPassword]); 
})

router.post('/login', async (req,res)=>{
    const {email, username, password} = req.body;
    if (!username || !email || !password){
        res.status(400).json({message: 'please fill all the required fields'})
    }
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email])

    if (userExits.rows.length===0){
        res.status(400).json({message: 'User Dosnt Exists'}) 
    }
    const userData = user.row[0];
    const isMatch = await bcrypt.compare(password, userData.password);
    if(!isMatch){
        return res.status(400).json({message: 'invalid credentials'});
    }
    const token = genrateToken(userData.id);
    res.cookie('token', token, cookieOption);
})

router.post('/logout' , async (res,req)=>{
    res.cookie('token'," ",{...cookieOption, maxAge:1});
    res.json({message: 'Logged Out Sucessfully'})
})
export default router