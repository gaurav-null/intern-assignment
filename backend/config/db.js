import {Pool} from 'pg'	;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})

pool.on("connect",() => {
	console.log("connected to db");
})

pool.on("error", (err) =>{
	console.log("Unexpected Error", err);
})

export default pool