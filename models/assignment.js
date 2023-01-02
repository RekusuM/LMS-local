mongoose = require('mongoose')

const AssignmentSchema = mongoose.Schema({
	register:{
		type: String,
		required: true
	},
	registerId:{
		type: String,
		required: true
	},
	date:{
		type: Date,
		required: true
	},
	class:{
		type: String,
		required: true
	},
	files:[{ 
		contentType: String, 
		data: Buffer,
		name: String
	}],
	grade:{
		type: Number,
		default:0
	},
	graded:{
		type: Boolean,
		default:false
	},
	ponderated:{
		type: Boolean,
		default:false
	}

})



module.exports = mongoose.model('Assignment', AssignmentSchema)
