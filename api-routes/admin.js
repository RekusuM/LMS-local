const express = require('express')
const router = express.Router()

const User = require('../models/userStudent')
const HashPassword = require('../services/encrypt')

router.get('/', async (req,res) => {
		
	try{
		const Admins = await User.find({role:'admin'})
			
		res.json(Admins)
		
	}catch(err){
		res.json({ message : err })
	}	
})


router.post('/', async (req,res) => {
	const hashedPassword = await HashPassword(req.body.password)

	const adminUser = new User({
		registerNumber: req.body.username,
		username: req.body.username,
		password: hashedPassword,
		role:"admin"
	})
	
		
	try{
		const savedAdmin = await adminUser.save()
			
		res.json(savedAdmin)
		
	}catch(err){
		res.json({ message : err })
	}	
})

module.exports = router
