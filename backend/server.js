import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const PORT = process.env.PORT; 
const app = express();

app.use(express.json());
app.use(cookieParser());
app.get("/", (req ,res)=> {
    res.send("Welcome?");
});

app.listen(PORT,()=>{
    console.log(`Server Running on port ${PORT}`);
})