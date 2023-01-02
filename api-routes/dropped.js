const express = require('express')
const router = express.Router()
const schedule = require('node-schedule')
const User = require('../models/userStudent')

router.get('/', async (req,res) => {
		
	try{
		const students = await User.find({droped:"false",role:"student"},{registerNumber:1})
		res.json(students)
		
	}catch(err){
		res.json({ message : err })
	}	
})


router.post('/', async (req,res) => {
	const students = await User.findOneAndUpdate({registerNumber:req.body.register},{droped:"true"})
	res.redirect("/drop")
})

router.post('/temporal', async (req,res) => {

		const students = await User.findOneAndUpdate({registerNumber:req.body.register},{droped:"true"})
		schedule.scheduleJob(req.body.date,()=>{
			 User.findOneAndUpdate({registerNumber:req.body.register},{droped:"false"})
		})


		res.redirect("/drop")
})

module.exports = router
