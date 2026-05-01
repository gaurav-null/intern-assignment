import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../config/db.js';
import { protect } from '../../middleware/auth.js';

const router = express.Router();
const cookieOption = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: false,
    maxAge: 30*24*60*60*1000
}

const genrateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: '30d',
    });
}

router.post('/register' , async (req,res) => {
    const {name, email, password} = req.body;
    if (!name || !email || !password){
        return res.status(400).json({message: 'please fill all the required fields'})
    }
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (userExists.rows.length>0){
        return res.status(400).json({message: 'User Already Exists'}) 
    }
    const hashedPassword = await bcrypt.hash(password, 10); 

    const newUser = await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) returning *', [name, email, hashedPassword]); 
    const token = genrateToken(newUser.rows[0].id);
    res.cookie('token', token, cookieOption);
    res.json({user:{id: newUser.rows[0].id, username: newUser.rows[0].name}})
})

router.post('/login', async (req,res)=>{
    const {email,  password} = req.body;
    if (!email || !password){
        return res.status(400).json({message: 'please fill all the required fields'})
    }
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email])

    if (user.rows.length===0){
        return res.status(400).json({message: 'User Doesnt Exist'}) 
    }
    const userData = user.rows[0];
    const isMatch = await bcrypt.compare(password, userData.password);
    if(!isMatch){
        return res.status(400).json({message: 'invalid credentials'});
    }
    const token = genrateToken(userData.id);
    res.cookie('token', token, cookieOption);
    res.json({user:{id: userData.id, username: userData.name, password: userData.password}    })
})

router.post('/logout' , async (req,res)=>{
    res.cookie('token'," ",{...cookieOption, maxAge:1});
    return res.json({message: 'Logged Out Successfully'})
})

router.post('/me', protect, async (req,res)=>{
    return res.json({user: req.user});
})

export default router