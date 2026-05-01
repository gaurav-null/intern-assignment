import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/v1/auth.js'
import todoRoutes from './routes/v2/todo.js'

dotenv.config();

const PORT = process.env.PORT; 
const app = express();

const allowedOrigins = (process.env.CLIENT_URL || '').split(',').map(url => url.trim());

app.use(cors({
    origin: (origin, callback) => {
        console.log('Incoming origin:', origin);
        console.log('Allowed origins:', allowedOrigins);
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}))
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v2/todos', todoRoutes);

app.listen(PORT,()=>{
    console.log(`Server Running on port ${PORT}`);
})