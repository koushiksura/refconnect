const express=require('express');
const { check, validationResult } = require('express-validator');
// const session = require('express-session');

const router = express.Router();
const bodyparser=require('body-parser');
var nodemailer = require('nodemailer');
var urlencodedparser=bodyparser.urlencoded({extended:false});
bodyParser = require('body-parser').json();

router.get('/hello',(req,res)=>{
    res.render('helloworld.ejs')
  });

router.get('/ngo_view',(req,res)=>{
    res.render('ngo.view.ejs',{"refugee_requests" : 5})
}) 

router.post('/getPatrons',(req,res)=>{
    res.json({"patrons" : 2})
})  

router.post('/getPatronDetails',(req,res)=>{
    res.json({"name" : 'lolaboy'})
})  


  module.exports = router;