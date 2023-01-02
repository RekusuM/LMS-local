const mongoose = require('mongoose')

const ClassroomStudent = mongoose.Schema({
	group: {
		type: String
	},
	classroom: {
		type: String
	},
	student: {
		type: String
	},
	firstPartialGrades: [{
		grade: String,
		category: String
	}],
	secondPartialGrades: [{
		grade: String,
		category: String
	}],
	thirdPartialGrades: [{
		grade: String,
		category: String
	}],
	partialGrades: [{
		grade: String	
	}],
	finalGrade: {
		type: String
	},
	passed: {
		type: Boolean,
		default: false
	},
	coursing: {
		type: Boolean,
		default: true
	}
})


module.exports = mongoose.model('ClassroomStudent', ClassroomStudent) 
