const mongoose = require('mongoose')

const VideoClassroom = mongoose.Schema({
	url: {
		type: String
	},
	group: {
		type: String
	},
	hour: {
		type: String
	},
	date: {
		type: Date,
		default: Date.now
	},
	students: [{
		type: String
	}]
})


module.exports = mongoose.model('VideoClassroom', VideoClassroom) 
