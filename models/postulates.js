mongoose = require('mongoose')

const PostulateSchema = mongoose.Schema({
	firstname: {
		type: String,
		required: true
	},
	lastname: {
		type: String,
		required: true
	},
	birthday:{
		type: Date,
		required: true
	},
	email:{
		type: String,
		required :true
	},
	certHighschool:{
		data: Buffer,
		contentType: String
	},
	curp:{
		data: Buffer,
		contentType: String
	},
	birthdayCert:{
		data: Buffer,
		contentType: String
	},
	antidoping:{
		data: Buffer,
		contentType: String
	}
})


module.exports = mongoose.model('Postulates', PostulateSchema)
