const mongoose = require('mongoose');

const PatronSchema = new mongoose.Schema({
	name: {
		type:String,
		required:true,
		lowercase:true
	},

	email: {
		type:String,
		required:true
	},

	phone_number: {
		type:String,
		required:true,
		maxlength:11,
	},

	home_address: {
		type:String,
		required:true
	},

	password:{
		type:String,
		required:true
	},
})


const Patron = mongoose.model('Patron',PatronSchema);

module.exports=Patron; 