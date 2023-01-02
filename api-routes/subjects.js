const express = require('express')
const router = express.Router()

const Subject = require('../models/subjects')
const UserStudent = require('../models/userStudent')
const verifyToken = require('../services/verifyToken')

router.post('/', async (req,res) => {
	try{
		const token = req.cookies.jwt
		const tokenData = await verifyToken(token)
		const user = await  UserStudent.findById(tokenData.uid,{career:1})
		const subject = new Subject({
			name:req.body.name,
			weight:req.body.weight,
			hoursPerWeek:req.body.hoursPerWeek,
			career:user.career
		})	

		await subject.save()

		res.status(200).redirect('/createSubject')
	}catch(err){
		res.json({ message : err })
	}	
})

router.get('/', async (req,res) => {
	try{	
		const token = req.body.jwt
		const tokenData = await verifyToken(token)
		const user = await  UserStudent.findById(tokenData.uid,{career:1})
	
		const subject = await Subject.find({career:user.career})	
		
		res.status(200).json(subject)
	}catch(err){
		res.json({ message : err })
	}	
})
module.exports = router
