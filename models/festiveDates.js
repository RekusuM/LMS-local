const mongoose = require('mongoose')

const FestiveDates = mongoose.Schema({
	event: {
		type: String
	},
	date: {
		type: Date
	},
	color: {
		type: String
	}
})


module.exports = mongoose.model('FestiveDates', FestiveDates) 
