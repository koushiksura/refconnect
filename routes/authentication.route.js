
// DB imports
const mongoose = require('mongoose')
const RefugeeUser = require('../models/refugee')
const PatronUser = require('../models/patron')
//const NGOUser = require('../models/ngouser')

//express imports
const express=require('express');
const router = express.Router();

//misc imports
var nodemailer = require('nodemailer');
const bodyparser=require('body-parser');
const NgoUser = require('../models/ngouser');
const { check, validationResult } = require('express-validator');
var urlencodedparser = bodyparser.urlencoded({extended:false});
const bcrypt=require('bcryptjs');
var passport=require('passport');

router.get('/signup',(req,res)=>{
    res.render('ngoSignup.view.ejs',{errors:[]})
  });
  
  
router.post('/signup',urlencodedparser,[
                                            check('password').not().isEmpty().withMessage('password is required'),
                                            check('password').isLength({min:6}).withMessage('Please enter a password at least 6 character.'),
                                            check('password').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,).withMessage('Password must contain one uppercase letter one lower case letter and one special character  '),
                                            check('password1').not().equals('password').withMessage('Passwords do not match'),
                                            check("email").not().isEmpty().withMessage('Email is required'),
                                            check('email').isEmail().withMessage('Enter valid email'),
  ],(req,res)=>{
    
    console.log(req.body);
    const password = req.body.password;
    const password1 = req.body.password1;
    const email = req.body.email;
  
    let errors = validationResult(req);
    NgoUser.findOne({email:email}).then(function(user){
        error = {
            param:'email',
            msg:'User already exist',
            value:email
  
        }
        errors.errors.push(error)       
    });
   console.log(errors.errors)
    if (errors.errors.length > 0){
        console.log('im here')
        res.render('ngoSignup.view.ejs',{
            errors:errors.errors
        });
    }
    else{
        let newNgo = new NgoUser({
            email:email,
            password:password,
        });
  
    bcrypt.genSalt(10,(err,salt)=>bcrypt.hash(newNgo.password,salt,(err,hash)=>
    { 
        if (err){
        console.log(err)
        };
        newNgo.password=hash;
        newNgo.save()
        .then(user=>res.redirect('./login'))
        .catch(err=>console.log(err))
  
  }))
  
      res.redirect('./login');
    }
  
  });


  router.get('/patron-signup',(req,res)=>{
    res.render('patronSignup.view.ejs',{errors:[]})
  });

  router.post('/patron-signup',urlencodedparser,[
    check('password').not().isEmpty().withMessage('password is required'),
    check('password').isLength({min:6}).withMessage('Please enter a password at least 6 character.'),
    check('password').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,).withMessage('Password must contain one uppercase letter one lower case letter and one special character  '),
    check('password1').not().equals('password').withMessage('Passwords do not match'),
    check("email").not().isEmpty().withMessage('Email is required'),
    check('email').isEmail().withMessage('Enter valid email'),
],(req,res)=>{

    console.log(req.body);
    const password = req.body.password;
    const password1 = req.body.password1;
    const email = req.body.email;

    let errors = validationResult(req);
    PatronUser.findOne({email:email}).then(function(user){
    error = {
        param:'email',
        msg:'User already exist',
        value:email
    }
    errors.errors.push(error)       
    });
    console.log(errors.errors)
    if (errors.errors.length > 0){
        console.log('im here')
        res.render('patronSignup.view.ejs',{
        errors:errors.errors
        });
    }
    else{
    let newPatron = new PatronUser({
        email:email,
        password:password,
    });

    bcrypt.genSalt(10,(err,salt)=>bcrypt.hash(newPatron.password,salt,(err,hash)=>
    { 
    if (err){
        console.log(err)
    };
    newPatron.password=hash;
    newPatron.save()
    .then(user=>res.redirect('./patronForm'))
    .catch(err=>console.log(err))

    }))

    res.redirect('./patron-login');
}

});


  router.get('/login',(req,res)=>{
    res.render('ngoLogin.view.ejs')
  });
  
  router.post('/login',(req,res,next)=>{
  passport.authenticate('local1',{
  
    successRedirect:'/ngo_view',
    failureRedirect:'/login/ngo',
    failureFlash:true
  })(req,res,next);
  });
  
  router.get('/patron-login',(req,res)=>{
    res.render('patronLogin.view.ejs')
  });

  router.post('/patron-login',(req,res,next)=>{
    passport.authenticate('local2',{
    
      successRedirect:'/patronOfferForm',
      failureRedirect:'/patron-login',
      failureFlash:true
    })(req,res,next);
    });

  router.get('/logout',(req,res)=>{
    req.logout()
    res.redirect('/auth/login')
  });

  module.exports = router;