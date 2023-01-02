const mongoose = require('mongoose')

const SubjectSchema = mongoose.Schema({
	name:{
		type:String
	},
	weight:{
		type:String
	},
	hoursPerWeek:{
		type:Number
	},
	career:{
		type:String
	}
})

module.exports = mongoose.model('Subjects', SubjectSchema)
