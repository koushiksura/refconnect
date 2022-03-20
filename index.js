const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyparser=require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const flash = require('connect-flash');
var multer =require('multer')
const http = require('http')
var app=express()
const server = http.createServer(app);
var passport=require('passport');


// app.use(expressLayouts);
app.set('view engine','ejs');
app.use(express.static('./static'));
app.use('/uploads', express.static('./uploads'))
app.use(express.static('./uploads'));
//app.use('/styles', express.static('styles'))

mongoose.connect('mongodb://hackathon-eleos:Awit3rJev4oBiVRZCVb22SO0sOuc5xVjIwggfBjl3iw9IEoI9DF1hlJav8CQChS78qoJlanqLdDYHxHPTYrLCw==@hackathon-eleos.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@hackathon-eleos@',{   useNewUrlParser: true,
    useUnifiedTopology: true
  })
.then(()=>console.log('connected to mongodb'))
.catch(err=>console.log(err))


//db congif
var urlencodedparser=bodyparser.urlencoded({extended:true,limit:'50mb'});
app.use(bodyparser.json({limit:'50mb'}));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,

}));

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);


app.use(urlencodedparser);
// app.use(flash());

// app.use(function (req, res, next) {
//     res.locals.success_msg = req.flash('success_msg');
//     res.locals.error_msg = req.flash('error_msg');
//     res.locals.error = req.flash('error');
//     next();
//   });
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname+'/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + Date.now()+ '.jpeg' )
    }
  })


  app.use('/',require('./routes/refugee.route'));
  app.use('/auth',require('./routes/authentication.route'));

  app.use(multer({ storage: storage }).any());
//   app.get("*", function(req, res){
//     res.render('error');
//   });

   server.listen(8000, function(){
     console.log("Connected to server")
   });
  console.log('you are listening to port 8000');
