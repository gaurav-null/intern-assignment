import express from 'express';
const PORT = 3000; 
const app = express();
app.get("/", (req ,res)=> {
    res.send("Welcome?");
});

app.listen(PORT,()=>{
    console.log(`Server Running on port ${PORT}`);
})