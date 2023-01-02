const mongoose = require('mongoose')

const RegisterCountSchema = mongoose.Schema({
	registerCount: {
		type: String,
		required: true
	}
})


module.exports = mongoose.model('RegisterCount', RegisterCountSchema)
