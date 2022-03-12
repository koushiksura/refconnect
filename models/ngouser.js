const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        lowercase : true
    },
    contact : {
        type : String,
        required : true,
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
        streetaddress : {
            type : String,
            required : true,
            lowercase : true,
        },
        locality : {
            type : String,
            required : true,
            lowercase : true
        },
        city : {
            type : String,
            required : true,
            lowercase : true
        },
        zip : {
            type : String,
            required : true,
            maxlength : 7
        }
    }

});

const Ngouser = mongoose.model('Ngouser',UserSchema);

module.exports = Ngouser;