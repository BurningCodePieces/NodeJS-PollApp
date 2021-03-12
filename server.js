//require('dotenv').config()
const mongoose= require('mongoose')
const express = require('express')
const userRouter=require('./routes/users')
const app = express()
const jwt=require("jsonwebtoken")
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
//middlewares
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cookieParser())

const JWT_SECRET="njevhwqwfvedfwkbsrbwlrwrbwbwrbbwbwrbwwbrwwb"

mongoose.connect('mongodb://$Credentials$', { useNewUrlParser: true, useUnifiedTopology:true})


app.set('view engine','ejs')
app.use(express.urlencoded({extended:false}))


app.use('/users',userRouter)

app.get('/not_logged',(req,res)=>{
    res.render("q.ejs")
})

app.get('/',(req,res)=>{
    res.redirect("/users/survey")
})

app.listen(3393)

//3004 3394 3393






