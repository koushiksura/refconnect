const mongoose = require('mongoose');

const RefugeeSchema = new mongoose.Schema({
	name: {
		type:String,
		required:true,
		lowercase:true,
	},

	age: {
		type: Number,
		required: true,
	}, 

	gender: {
		type: String,
		required: true,
		lowercase: true,
	},

	govID: {
		type: String,
		lowercase: true,
	},

	email: {
		type:String,
	},

	phone_number: {
		type:String,
		maxlength:11,
	},

	home_address: {
		
		street: {
			type: String, 
			required:true,
			lowercase:true,
		},

		locality: {
			type: String, 
			required: true,
			lowercase: true,
		},

		city: {
			type: String, 
			required: true,
			lowercase: true,
		},

		zipcode: {
			type: Number, 
			required: true, 
			lowercase: true,
		}

	},

})


const Refugee = mongoose.model('Refugee',RefugeeSchema);

module.exports=Refugee; 