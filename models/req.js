const mongoose = require('mongoose');
const patron = require('./patron');

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
        type : mongoose.Schema.Types.ObjectId,
        ref : patron
    }
});

const Request = mongoose.model('RefugeeRequest',ReqSchema);

module.exports = Request;