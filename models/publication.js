mongoose = require('mongoose')

const PublicationSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	content:{
		type: String,
		required: true
	},
	class:{
		type: String,
		required: true
	},
	assignation:{
		type: Boolean,
		default: false
	},
	publicationDate:{
		type: Date,
		default: Date.now
	},
	deliveryDate:{
		type: Date
	},
	files:[{ 
		contentType: String, 
		data: Buffer,
		name: String
	}],
	criteria:[{
		contentType: String,
		criteria: String,
		weight: String
	}],
	ytLink:{
		type:String
	},
	ponderation:{
		type:String
	},
	category:{
		type: String
	}


})



module.exports = mongoose.model('Publication', PublicationSchema)
