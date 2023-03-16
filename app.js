const express = require('express')
const app = express()
const bodyparser=require('body-parser');
const port = 3000
const mongoose = require('mongoose');
require('dotenv').config()
console.log(process.env.SECRET)
var encrypt = require('mongoose-encryption');
app.use(bodyparser.urlencoded({extended:true}));
mongoose.connect('mongodb://127.0.0.1:27017/secret');
app.set('view engine', 'ejs');
const schma= new mongoose.Schema({
   
    email:String,
    password:String
});
var secret=process.env.SECRET;

schma.plugin(encrypt, { secret: secret ,encryptedFields: ["password"] });
const model=mongoose.model("secretData",schma);


app.get('/', (req, res) => {
  res.render("home")
})
app.get('/register', (req, res) => {
  
    res.render("register")
  })

  app.get('/login', (req, res) => {
    res.render("login")
  })
  app.get('/logout', (req, res) => {
    res.render("home")
  })
  app.post('/register',(req,res)=>{
      const data= new model({
         email:req.body.email,
         password:req.body.password
      })
      data.save(function(err){
        if(!err){
           res.redirect('/')
            console.log("saved to db");
           
        }
      })
  })
  app.post("/login",(req,res)=>{
          const email1=req.body.email;
          const password1=req.body.password;
          model.findOne({email:email1},function(err,data1){
            if(!err && data1){
              if(data1.password===password1){
                res.render("secrets");
              }
             
            }
          })
  })

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
