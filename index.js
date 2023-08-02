const express= require('express')
const app = express()
require('dotenv').config()
const bodyparser = require('body-parser')
const ejs = require('ejs')

var con = require('./connection')
const bodyParser = require('body-parser')
const testRoute = require('./routes/testRoute')


app.set('view engine','ejs')
// middleware

app.use(bodyParser.json())
app.use(bodyparser.urlencoded({extended:true}))

// route
app.use('/api', testRoute)
app.get('/',(req,res)=>{
    res.sendFile(__dirname +'/form.html')
})


app.post('/', function (req, res) {
var { name , email } = req.body
    var emailcheck = 'SELECT * FROM test WHERE email = ?';
    con.query(emailcheck, [email], function (err, result) {
        if (err) throw err;

        if (result.length > 0) {
            
            res.status(409).send('Email already exists in the database.');
        } else {
            
            var insertSql = 'INSERT INTO test (username, email) VALUES (?, ?)';
            con.query(insertSql, [name, email], function (err, result) {
                if (err) throw err;
                console.log('Data Uploaded');
                res.redirect('/');
            });
        }
    });
});

app.get('/',(req,res)=>{
    var sql = 'SELECT * FROM test';
    con.query(sql , function(err , result){
        if(err) throw err

res.render('display' , { test : result})
    })
})

app.listen(3500 ,()=>{
    console.log('server is running at port : 3500');

   
})