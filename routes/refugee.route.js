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


  module.exports = router;