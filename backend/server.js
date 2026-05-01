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
    origin: function (origin, callback) {
        const clientUrl = process.env.CLIENT_URL;
        console.log('CLIENT_URL env var:', clientUrl);
        console.log('Incoming origin:', origin);
        
        if (!origin || origin === 'https://gaurav-null.github.io' || origin === 'https://gaurav-null.github.io/intern-assignment') {
            callback(null, true);
        } else if (clientUrl && clientUrl.includes(origin)) {
            callback(null, true);
        } else {
            console.log('CORS rejected:', origin);
            callback(null, true); // Allow anyway for debugging
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