const mongoose = require('mongoose');
const Ngouser = require('./ngouser');

const ReqSchema = new mongoose.Schema({
    refugees : {
        type : [],
        required : true,
    },
    numofppl : {
        type : Number,
        required : true
    },
    status : {
        type: String,
        required : true
    },
    assigned : {
        type : Schema.Types.ObjectId,
        ref : Ngouser
    }
});

const Request = mongoose.model('Req',ReqSchema);

module.exports = Request;