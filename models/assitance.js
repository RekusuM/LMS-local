mongoose = require('mongoose')

const AssistanceSchema = mongoose.Schema({
	student:{
		type: String
	},
	room:{
		type: String
	},
	date:{
		type: Date,
		default:Date.now()
	}
})



module.exports = mongoose.model('Assistance', AssistanceSchema)
