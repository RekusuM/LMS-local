const express = require('express')
const router = express.Router()

const verifyToken = require('../services/verifyToken')
const assistance = require('../models/assitance')
const UserStudent = require('../models/userStudent')
router.get('/', async (req,res) => {
	
	const token = req.body.jwt
	const tokenData = await verifyToken(token)

	console.log(tokenData)
	const user = await  UserStudent.findById(tokenData.uid,{username:1})
	console.log(user)
	const assistanceCreated = new assistance({
		student:tokenData.uid,
		room:req.body.room,
	})

	await assistanceCreated.save()
	try{
		res.status(200).json(user)

	}catch(err){
		res.json({ message : err })
	}	
})

module.exports = router

