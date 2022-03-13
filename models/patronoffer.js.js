const mongoose = require('mongoose')
<<<<<<< HEAD
const patronUser = require('./patron.js')
=======
const patronUser = require('./patron')
>>>>>>> 07932b1210f3ef45070baaa8817762cd71026178

const PatronOfferSchema =  new mongoose.Schema({

	patronID: { 
		type: mongoose.Schema.Types.ObjectId, 
<<<<<<< HEAD
		ref: patronUser 
=======
		ref: 'Patron' 
>>>>>>> 07932b1210f3ef45070baaa8817762cd71026178
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