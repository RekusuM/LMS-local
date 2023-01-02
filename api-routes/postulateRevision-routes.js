const express = require('express')
const router = express.Router()

const UserStudent = require('../models/userStudent')
const Postulates = require('../models/postulates')

const HashPassword = require('../services/encrypt')
const GenerateRegister = require('../services/registerGenerator')
const RegisterCount = require('../models/studentRegisterCount')


router.post('/', async (req,res) => {
	const hashedPassword = await HashPassword(req.body.birthday)
	console.log(req.body)		
	const register = await GenerateRegister()

	const studentUser = new UserStudent({
		username: req.body.firstname,
		password: hashedPassword,
		registerNumber: register,
		role:"student",
		group: 1
	})
	

	let studentCount = ""

	studentCount = register
	studentCount = studentCount.substring(2)
		
	try{
		const savedPostulate = await studentUser.save()
			
		await Postulates.findOneAndDelete({ email: req.body.email})
	
		res.redirect('back')
		
		await RegisterCount.findOneAndUpdate({registerCount: studentCount})


	}catch(err){
		res.json({ message : err })
	}	
})

module.exports = router
