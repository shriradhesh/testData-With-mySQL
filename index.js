const express= require('express')
const app = express()
const session = require('express-session')
const passPort = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const GOOGLE_CLIENT_ID = "929356021478-kdclp70itl56jt75atvdjegldn6pqi8e.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "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"
require('dotenv').config()
const bodyParser = require('body-parser')
const ejs = require('ejs')
const testRoute = require('./routes/testRoute')

                // DATABASE CONNECTION 
var con = require('./connection')
const passport = require('passport')



                // view engine 

app.set('view engine','ejs')

                    // middleware

app.use(session({
    resave : false,
    saveUninitialized : true,
    secret : 'SECRET'
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

var userProfile;
app.use(passport.initialize());
app.use(passPort.session())

// route
app.use('/api', testRoute)

app.get('/',(req,res)=>{
    res.render('login')
})


app.get('/success', (req,res)=>{
    res.send(userProfile)
})

app.get('/error', (req,res)=>{
    res.send("error logging in")
})

  passport.serializeUser((user,cb)=>{
    cb(null , user)
  })

  passPort.deserializeUser((obj , cb)=>{
    cb(null , obj)
  })

passport.use(new GoogleStrategy({
clientID : GOOGLE_CLIENT_ID,
clientSecret : GOOGLE_CLIENT_SECRET,
callbackURL : "http://localhost:3500/auth/google/callback"
}, (accessToken , refreshToken , profile , done)=>{
    userProfile = profile;
    return done(null, userProfile)
}))

app.get('/auth/google',passport.authenticate('google',{ 
     scope : ['profile','email' ]}))

app.get('/auth/google/callback', passPort.authenticate('google', { failureRedirect : '/error'}),
 (req,res)=>{
    res.redirect('/success')
 })





app.listen(3500 ,()=>{
    console.log('server is running at port : 3500');

   
})