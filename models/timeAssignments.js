const mongoose = require('mongoose')

const TimeAssignmentsSchema = mongoose.Schema({
	startSemester: {
		type: Date
	},
	endSemester: {
		type: Date
	},
	startFirstPartial: {
		type: Date
	},
	endFirstPartial: {
		type: Date
	},
	startSecondPartial: {
		type: Date
	},
	endSecondPartial: {
		type: Date
	},
	startThirdPartial: {
		type: Date
	},
	endThirdPartial: {
		type: Date
	}
})


module.exports = mongoose.model('TimeAssignments', TimeAssignmentsSchema) 
