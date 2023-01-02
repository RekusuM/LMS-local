const mongoose = require('mongoose')

const GroupSchema = mongoose.Schema({
	group:{
		type:String
	},
	schedule:{
		type:[String]
	},
	videoCalls:{
		type:[String]
	}
})

module.exports = mongoose.model('Group', GroupSchema)
