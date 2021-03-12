const express = require('express')
const User = require('./../models/user')
const Answer = require('./../models/answer')
const router = express.Router()
const jwt=require("jsonwebtoken")
const request = require('request');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');


const JWT_SECRET="njevhwqwfvedfwkbsrbwlrwrbwbwrbbwbwrbwwbrwwb"

router.get('/new_user',(req,res)=>{
    res.render('users/new_user.ejs')
})
router.get('/login', (req,res)=>{
    res.render('users/login.ejs')
})

router.get('/survey',checkToken, (req,res)=>{
    res.render('index.ejs')
})

router.get('/my_answers',checkToken, async(req,res)=>{
    decoded = jwt.verify(req.cookies.jwt, JWT_SECRET);
    const e = decoded.email

    const answer= await Answer.findOne({email:e}).lean()
    if(answer)
    res.render("users/my_answer.ejs",{'answer':answer})
    else
    res.render("users/no_answer.ejs")
})

router.get('/logout',(req,res)=>{
    res.clearCookie('jwt')
    res.clearCookie('jwtr')
    res.redirect("/users/login")
})

router.post('/survey',checkToken,async (req,res)=>{
    //res.json(req.body)
    decoded = jwt.verify(req.cookies.jwt, JWT_SECRET);
    let answer=new Answer({
        email:decoded.email,
        first_answer:req.body.exampleRadios,
        second_answer:req.body.exampleRadios1,
        third_answer:req.body.exampleRadios2
    })

    try{
    answer=await answer.save()
    res.redirect('/users/survey')
    }
    catch (e)
    {
        console.log(e)
    res.render('users/answer_already_exists.ejs')
    }
})


router.get('/notValid',(req,res)=>{
    res.render('users/notValid.ejs')
})

router.get('/results',checkToken, async(req,res)=>{
    /* awful code, but fixing that requires more time than the student has */
     f_q_f_a=await Answer.find({first_answer:0})
     f_q_s_a=await Answer.find({first_answer:1})
     f_q_t_a=await Answer.find({first_answer:2})
     s_q_f_a=await Answer.find({second_answer:0})
     s_q_s_a=await Answer.find({second_answer:1})  
     s_q_t_a=await Answer.find({second_answer:2})
     t_q_f_a=await Answer.find({third_answer:0})
     t_q_s_a=await Answer.find({third_answer:1})
     t_q_t_a=await Answer.find({third_answer:2})
    result=[f_q_f_a.length,f_q_s_a.length,f_q_t_a.length, s_q_f_a.length,s_q_s_a.length,s_q_t_a.length,t_q_f_a.length,t_q_s_a.length,t_q_t_a.length]
    res.render('users/results.ejs',{'result':result})
})


router.post('/login', async (req,res)=>{
    const e = req.body.email
    const p = req.body.password

    const user= await User.findOne({email:e}).lean()
    if(user){
    if(p==user.password){
        res.clearCookie('jwt')
        res.clearCookie('jwtr')
        //const token=jwt.sign({id: user._id,email: user.email},JWT_SECRET)
        const accessToken=jwt.sign({id: user._id,email: user.email},JWT_SECRET, {expiresIn:'100m'})
        const refreshToken = jwt.sign({id: user._id,email: user.email}, JWT_SECRET)
        res.cookie('jwt',accessToken)
        res.cookie('jwtr',refreshToken)
        res.redirect(302,'/users/survey')
    }
    else
    res.render("users/wrong_email_password.ejs")
    }
    else{
        res.render("users/wrong_email_password.ejs")
    }
})

router.post('/new_user',async (req,res)=>{
    let user=new User({
        email:req.body.email,
        password:req.body.password
    })
    

    try{
        if(user.password.length<=100)
            {user=await user.save()
            res.redirect('/users/login')}
        else{
            res.json("Za długie hasło")
        }
    }
    catch (e)
    {
        console.log(e)
    res.render('users/wrong_email.ejs')
    }

})

function checkToken (req, res,next) {
    //get authcookie from request
    const authcookie = req.cookies.jwt
    const refcookie = req.cookies.jwtr
    //verify token which is in cookie value
    jwt.verify(authcookie,JWT_SECRET,(err,data)=>{
     if(err){
         res.redirect("/users/notValid")
     } 
     else if(data){
      res.id = data.id
      try{
       return next()
      }
      catch (e){
      res.json(e)}
    }
})}

function generateAccessToken(user){
    return jwt.sign({id: user._id,email: user.email},JWT_SECRET, {expiresIn:'5s'})
}


module.exports = router

