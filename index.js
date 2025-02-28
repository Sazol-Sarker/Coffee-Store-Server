const express=require('express')

const app=express()
const cors=require('cors')
const port=process.env.PORT || 5000

// MIDDLEWARE
app.use(cors())
app.use(express.json())


// APIs
app.get('/',(req,res)=>{
    res.send("Coffee server running...!")
})

// LISTEN to port
app.listen(port,()=>{
    console.log("Coffee server running at port= ", port);
})