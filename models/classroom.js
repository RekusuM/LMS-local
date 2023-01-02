const mongoose = require('mongoose')

const ClassroomSchema = mongoose.Schema({
	group:{
		type:String
	},
	subject:{
		type:String
	},
	teacher:{
		type:String
	}
})

module.exports = mongoose.model('Classroom', ClassroomSchema)
