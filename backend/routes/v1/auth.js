import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../config/db.js';
import { protect } from '../../middleware/auth.js';

const router = express.Router();
const cookieOption = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 30*24*60*60*1000
}

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidPassword = (password) => {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password);
};

const genrateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: '30d',
    });
}

router.post('/register' , async (req,res) => {
    const {name, email, password} = req.body;
    

    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedPassword = password?.trim();
    
    if (!trimmedName || !trimmedEmail || !trimmedPassword){
        return res.status(400).json({message: 'please fill all the required fields'})
    }
    

    if (!isValidEmail(trimmedEmail)) {
        return res.status(400).json({message: 'Invalid email format'})
    }
    

    if (!isValidPassword(trimmedPassword)) {
        return res.status(400).json({message: 'Password must be at least 8 characters with uppercase, lowercase, and number'})
    }
    

    if (trimmedName.length < 2 || trimmedName.length > 50) {
        return res.status(400).json({message: 'Name must be between 2 and 50 characters'})
    }
    
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [trimmedEmail])
    if (userExists.rows.length>0){
        return res.status(400).json({message: 'User Already Exists'}) 
    }
    
    const hashedPassword = await bcrypt.hash(trimmedPassword, 10); 

    const newUser = await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) returning *', [trimmedName, trimmedEmail, hashedPassword]); 
    const token = genrateToken(newUser.rows[0].id);
    res.cookie('token', token, cookieOption);
    res.json({user:{id: newUser.rows[0].id, username: newUser.rows[0].name}, token})
})

router.post('/login', async (req,res)=>{
    const {email, password} = req.body;
    
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedPassword = password?.trim();
    
    if (!trimmedEmail || !trimmedPassword){
        return res.status(400).json({message: 'please fill all the required fields'})
    }
    
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [trimmedEmail])

    if (user.rows.length===0){
        return res.status(400).json({message: 'Invalid credentials'}) 
    }
    const userData = user.rows[0];
    const isMatch = await bcrypt.compare(trimmedPassword, userData.password);
    if(!isMatch){
        return res.status(400).json({message: 'Invalid credentials'});
    }
    const token = genrateToken(userData.id);
    res.cookie('token', token, cookieOption);
    res.json({user:{id: userData.id, username: userData.name}, token})
})

router.post('/logout' , async (req,res)=>{
    res.cookie('token'," ",{...cookieOption, maxAge:1});
    return res.json({message: 'Logged Out Successfully'})
})

router.post('/me', protect, async (req,res)=>{
    return res.json({user: req.user});
})

export default router