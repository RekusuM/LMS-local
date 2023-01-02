const express = require('express')
const router = express.Router()

const User = require('../models/userStudent')
const HashPassword = require('../services/encrypt')
const verifyToken = require('../services/verifyToken')


router.get('/', async (req,res) => {
		
	try{
		const token = req.body.jwt
		const tokenData = await verifyToken(token)
		const user = await  User.findById(tokenData.uid,{career:1})
		const Teachers = await User.find({role:'teacher',career:user.career},{password:0,firstTimeLogged:0})
			
		res.json(Teachers)
		
	}catch(err){
		res.json({ message : err })
	}	
})


router.post('/', async (req,res) => {
	const hashedPassword = await HashPassword(req.body.password)

	const teacherUser = new User({
		registerNumber: req.body.username,
		username: req.body.username,
		password: hashedPassword,
		role:"teacher",
		career:req.body.career
	})
	
		
	try{
		const savedTeacher = await teacherUser.save()
			
		res.json(savedTeacher)
		
	}catch(err){
		res.json({ message : err })
	}	
})

module.exports = router
