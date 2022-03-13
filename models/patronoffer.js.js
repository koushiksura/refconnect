const mongoose = require('mongoose')
const patronUser = require('./patron.js')

const PatronOfferSchema =  new mongoose.Schema({

	patronID: { 
		type: mongoose.Schema.Types.ObjectId, 
		ref: patronUser 
	},

	noPeople: {
		type: Number, 
	},

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
		},

		zip: {
			type: Number, 
			required: true, 
			lowercase: true,
		}

	}

})


const PatronOffer = mongoose.model('PatronOffer',PatronOfferSchema);

module.exports = PatronOffer; 