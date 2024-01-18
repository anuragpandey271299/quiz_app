const express=require('express')
const dotenv=require('dotenv').config()
const mongoose=require('mongoose')
const user=require('./Models/user')
const app=express()

app.listen(process.env.PORT,()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>console.log('connected to DB'))
    .catch((error)=>console.log(error))
    console.log(`server is running on http://localhost:${process.env.PORT}`)
})