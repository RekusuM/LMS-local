const express = require('express')
const router = express.Router()

const UserStudent = require('../models/userStudent')
const Group = require('../models/groups')

router.get('/', async (req,res) => {
	try{
		const user = await UserStudent.find({'role':'student'},{'password':0, 'firstTimeLogged':0, 'role':0, 'username':0})
		
		res.status(200).json(user)

	}catch(err){
		res.json({ message : err })
	}	
})

router.get('/all', async (req,res) => {
	try{
		const group = await Group.find({})
		
		res.status(200).json(group)

	}catch(err){
		res.json({ message : err })
	}	
})

router.post('/assignStudent', async (req,res) => {
	try{
		console.log(req.body)
		await UserStudent.findOneAndUpdate({'registerNumber': req.body.registerNumber},{group: req.body.group})
		
		res.status(200).redirect("/assignGroups")
	}catch(err){
		res.json({ message : err })
	}	
})

router.post('/create', async (req,res) => {
	try{
		const groups = new Group({
			group:req.body.group
		})

		await groups.save()

		res.status(200).redirect("/assignGroups")

	}catch(err){
		res.json({ message : err })
	}	
})
module.exports = router
