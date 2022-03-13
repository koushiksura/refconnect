const express=require('express');
const { check, validationResult } = require('express-validator');
// const session = require('express-session');

const mongoose = require('mongoose')
const NGOUser = require('../models/ngouser')
const Refugeerequest = require('../models/req')
const Refugee = require('../models/refugee')

const router = express.Router();
const bodyparser=require('body-parser');
var nodemailer = require('nodemailer');
const { findById } = require('../models/ngouser');
const wellKnown = require('nodemailer/lib/well-known');
var urlencodedparser=bodyparser.urlencoded({extended:false});
bodyParser = require('body-parser').json();

ngouser_id = '622d5aa13b43b65219d17e80'

router.get('/hello',(req,res)=>{
    res.render('helloworld.ejs')
  });

  router.get('/refugeeForm',(req,res)=>{
      res.render('refugeeFormTemplate.ejs')
    });

router.get('/ngo_view',(req,res)=>{
  Refugeerequest.find({NgoId : new mongoose.Types.ObjectId(ngouser_id)}).lean().then(async (requests)=>{
      for (let  i = 0; i < requests.length;i++){
        const each_names = [];
        requests[i].names = [];
        for(let j = 0; j < requests[i].refugees.length;j++){
          var string_id  = String((requests[i].refugees[j]).valueOf())
          await Refugee.findById(string_id).then((res)=>{
          each_names.push(res.firstname.concat(" ",res.lastname))
          })
        }
        requests[i].names = each_names
      }
      console.log(requests)
      res.render( 'ngo.view.ejs' , { refugee_requests : requests} )
  })
})


router.post('/getPatrons',(req,res)=>{
    res.json({"patrons" : 2})
})

router.post('/getPatronDetails',(req,res)=>{
    res.json({"name" : 'lolaboy'})
})



// When the SUBMIT button on the new refugee form is hit.
router.post('/addNewRefugee', (req, res)=>{
    console.log(req.body)
})

router.get('/newRefugeeForm', (req,res)=>{
    res.render('ngo.view.ejs',{"refugee_requests" : 5})
}) 

//Manually add new GMU. 
router.get('/addNewNGO',(req,res)=>{
    let newNGOUser = new NGOUser({
        name: 'WeLovePeace',
        phone_number: 9889889889,
        email: 'welovepeace@go.com',
        password: 'hi@1234',
        address:{ street: 'Shein Kutler Road',
        locality: 'Meine glucklish', city: 'Berlin', zip: '120728'}
})
    newNGOUser.save()
.then(console.log("SAVED!"))
  });

// END OF ADD NEW NGO.



  module.exports = router;


//   const express=require('express');
// const { check, validationResult } = require('express-validator');
// // const session = require('express-session');

// const mongoose = require('mongoose')
// const NGOUser = require('../models/ngouser')
// const request = require('../models/req')

// const router = express.Router();
// const bodyparser=require('body-parser');
// var nodemailer = require('nodemailer');
// var urlencodedparser=bodyparser.urlencoded({extended:false});
// bodyParser = require('body-parser').json();

// router.get('/hello',(req,res)=>{
//     res.render('helloworld.ejs')
//   });

// router.get('/push',(req,res)=>{
//     let newNGOUser = new NGOUser({
//         name: 'WeLovePeace',
//         contact: 9889889889,
//         email: 'welovepeace@go.com',
//         password: 'hi@1234',
//         home_address:{ street: 'Shein Kutler Road',
//         locality: 'Meine glucklish', city: 'Berlin', zipcode: '120728'}
// })

// newNGOUser.save()
// .then(console.log("SAVED!"))
//   });

// router.get('/req',(req,res)=>{
//     let newreq = new request({
//         refugees : ['622d27ef3ac00628861f6551'],
//         numofppl: ['622d27ef3ac00628861f6551'].length,
//         status: 'Pending',
//         assigned: '622d247386c929fa64d0fffb'
//     })

// newreq.save()
// .then(console.log("Saved."))
// })


//   module.exports = router;
