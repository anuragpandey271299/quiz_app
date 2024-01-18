const express=require('express')
const dotenv=require('dotenv').config()
const bodyParser=require('body-parser')
const cors=require('cors')
const mongoose=require('mongoose')
const user=require('./Models/user')
const signupUser=require('./Routes/signupUser') 
const loginUser=require('./Routes/loginUser')

const app=express()
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cors())


app.use('/',signupUser)
app.use('/',loginUser)

app.listen(process.env.PORT,()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>console.log('connected to DB'))
    .catch((error)=>console.log(error))
    console.log(`server is running on http://localhost:${process.env.PORT}`)
})