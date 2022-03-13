const mongoose = require('mongoose')
const patronUser = require('Patron')

const PatronOfferSchema =  new mongoose.schema({

	patronID: { 
		type: Schema.Types.ObjectId, 
		ref: 'Patron' 
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