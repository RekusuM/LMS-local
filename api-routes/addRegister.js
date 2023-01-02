const express = require('express')
const router = express.Router()

const Register = require('../models/studentRegisterCount')


router.post('/', async (req,res) => {
	try{
		const count = new Register({
			registerCount:req.body.count,
		})	

		await count.save()

		res.status(200).json(count)
	}catch(err){
		res.json({ message : err })
	}	
})


module.exports = router
