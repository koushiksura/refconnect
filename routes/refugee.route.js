const express=require('express');
const { check, validationResult } = require('express-validator');
// const session = require('express-session');

const mongoose = require('mongoose')
const NGOUser = require('../models/ngouser')
const RefugeeUser = require('../models/refugee')
const PatronUser = require('../models/patron')
const PatronOffer = require('../models/patronoffer.js')

// Searching module
const MiniSearch = require('minisearch')


// const request = require('../models/req')

const router = express.Router();
const bodyparser=require('body-parser');
var nodemailer = require('nodemailer');
var urlencodedparser=bodyparser.urlencoded({extended:false});
bodyParser = require('body-parser').json();

router.get('/hello',(req,res)=>{
    res.render('helloworld.ejs')
  });

    // When the New Refugee form is visited
    router.get('/refugeeForm',(req,res)=>{
      res.render('refugeeFormTemplate.ejs')
    });


  // When the SUBMIT button on the new refugee form is hit.
    router.post('/refugeeForm', (req, res)=>{
    let newRefugeeUser = new RefugeeUser({

        firstname: req.body.firstname,
        lastname: req.body.lastname,
        age: req.body.age,
        gender: req.body.age,
        govID: req.body.govID,
        phone_number: req.body.phone_number,
        email: req.body.email,
        home_address:{ street: req.body.street,
        locality: req.body.locality, city: req.body.city, zip: req.body.zip}

    })

        newRefugeeUser.save()
        .then(res.redirect('/ngo_view'))
    })
    

    // When the Patron form is visited
    router.get('/patronForm',(req,res)=>{
        res.render('patronForm.ejs')
      });

    // When the SUBMIT button on the new Patron form is hit.
    router.post('/patronForm',(req,res)=>{
    let newPatronUser = new PatronUser({
        name: req.body.firstname + req.body.lastname,
        phone_number: req.body.phone_number,
        email: req.body.email,
        address: req.body.street + " " 
        + req.body.locality + " " + 
        req.body.city + " " + req.body.zip,
        password: "Patron@1234"

      })

        newPatronUser.save()
        .then(res.redirect('/ngo_view'))
    })


router.get('/ngo_view',(req,res)=>{

    res.render('ngo.view.ejs',{"refugee_requests" : 5})
})

router.post('/getPatrons',(req,res)=>{




    res.json({"patrons" : 2})
})

router.post('/getPatronDetails',(req,res)=>{



    res.json({"name" : 'lolaboy'})
})


// Used to display Refugee Request Registration
router.get('/newRefugeeRequestRegistration', (res, req)=>{
    res.render('refugeeRequestForm.ejs')
})


// Used by 'RefugeeRequest' module
router.post('/searchRefugeesbyName', (req, res)=>{
RefugeeUser.find({}, function(err,findresults){
    if(err){
      console.log(err);
    }
    else{
          let miniSearch = new MiniSearch({
          fields: ['firstname', 'lastname'], // fields to index for full-text search
          storeFields: ['_id','firstname', 'lastname'] // fields to return with search results
        })

          miniSearch.addAll(findresults)

          let results = miniSearch.search(req.body.searchkeyword)

          res.json({'data': results})
      }
})
})


// When the SUBMIT button on the new refugee form is hit.
// router.post('/addNewRefugee', (req, res)=>{
//     console.log(req.body)
// })

// router.get('/newRefugeeForm', (req,res)=>{
//     res.render('ngo.view.ejs',{"refugee_requests" : 5})
// })


//Find loved one's module

router.get('/findLoved',  (req, res)=> {

    var resultList = []

    refugeeFirstName = "Alec"
    refugeeLastName = "Thompson"

    RefugeeUser.find({firstname: refugeeFirstName, 
        lastname: refugeeLastName}, async function(err,findresults){
    if(err){
      console.log(err);
    }

    else{

        searchLastName =  findresults[0].lastname
        searchStreet = findresults[0].home_address.street
        searchLocality = findresults[0].home_address.locality

        var search1Criteria = [searchLastName, searchStreet, searchLocality]
        var search2Criteria = ["lastname", "home_address.street","home_address.locality"]

        // RefugeeUser.find({'lastname': searchLastName}, function(err, findresults){

        //     if(err){
        //         console.log(err)
        //     }
        //     else{

        //         for (var i = 0; i < findresults; i++) {
        //             resultList.push(findresults[i]._id)                
        //             }

        //     }
        //     });


        // RefugeeUser.find({'home_address.street': searchStreet}, function(err, findresults){

        //     if(err){
        //         console.log(err)
        //     }
        //     else{

        //         console.log("H")

        //         for (var i = 0; i < findresults; i++) {
        //             resultList.push(findresults[i]._id)                
        //             }

        //     }
        //     });


        // RefugeeUser.find({'home_address.locality': searchLocality}, function(err, findresults){

        //     if(err){
        //         console.log(err)
        //     }
        //     else{

        //         for (var i = 0; i < findresults; i++) {
        //             resultList.push(findresults[i]._id)                
        //             }

        //     }
        //     });


        // console.log(resultList)

        for (var k = 0; k < search2Criteria.length; k++) {
            let temp1 = search2Criteria[k];
            let temp2 = search1Criteria[k];
            console.log(temp1, temp2)
       await RefugeeUser.find({temp1: temp2}, function(err, findresults){

            if(err){
                console.log(err)
            }
            else{
                console.log(findresults)
                for (var i = 0; i < findresults.length; i++) {
                    console.log(findresults[i])
                    resultList.push(findresults[i])                
                    }
                    console.log(resultList)

            }
            })

        

    }

    }
})

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





router.get('/addNewPatronOffer', (req, res)=>{
    let newPatronOffer = new PatronOffer({
        patronID: mongoose.Types.ObjectId("622d7b6cc5c83d313e74fb7e"),
        noPeople: 2,
        addressOfAccomodation:{ street: 'Merke Hurt Road',
        locality: 'Nicht Traurig', city: 'Berlin', zip: '120745'}

})

        newPatronOffer.save()
.then(console.log("SAVED!"))
})




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
