const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        //required : true,
        lowercase : true
    },
    phone_number: {
        type : String,
        //required : true,
        maxlength : 11
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    address : {
        street : {
            type : String,
            //required : true,
            lowercase : true,
        },
        locality : {
            type : String,
           // required : true,
            lowercase : true
        },
        city : {
            type : String,
           // required : true,
            lowercase : true
        },
        zip : {
            type : Number,
           // required : true,
            maxlength : 7
        }
    },

});

const NgoUser = mongoose.model('NgoUser',UserSchema);

module.exports = NgoUser;