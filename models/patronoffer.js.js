const mongoose = require('mongoose')
const patronUser = require('Patron')

const PatronOffer =  new mongoose.schema({

	patronID: { 
		type: Schema.Types.ObjectId, 
		ref: 'Patron' 
	},

	noPeople: {
		type: Number, 
	}

	addressOfAccomodation: {

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
		}

		zipcode: {
			type: Number, 
			required: true, 
			lowercase: true,
		}

	}

})


const Refugee = mongoose.model('Refugee',RefugeeSchema);

module.exports=Refugee; 