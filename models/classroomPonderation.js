const mongoose = require('mongoose')

const ClassroomPonderation = mongoose.Schema({
	classroomId:{
		type:String
	},
	ponderations:[{
		name:String,
		ponderation:String
	}]

})

module.exports = mongoose.model('ClassroomPonderation', ClassroomPonderation)
