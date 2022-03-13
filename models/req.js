const mongoose = require('mongoose');
const patron = require('./patron');
const refugee = require('./refugee')

const ReqSchema = new mongoose.Schema({
    refugees : {
        type : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : refugee
            }
        ],
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
    },
    time : {
        type : Date,
        default : Date.now
    }
});

const Request = mongoose.model('RefugeeRequest',ReqSchema);

module.exports = Request;