const express = require('express')
const router = express.Router()

const Classroom = require('../models/classroom')
const userStudent = require('../models/userStudent')
const verifyToken = require('../services/verifyToken')
const classroomStudent = require('../models/classroomStudent')
const Ponderation = require('../models/classroomPonderation')
const { stringify } = require('uuid')

router.post('/', async (req,res) => {
	try{
		const classroom = new Classroom({
			subject:req.body.subject,
			group:req.body.group,
			teacher:req.body.teacher
		})
		
		await classroom.save()


		const users = await userStudent.find({group:req.body.group},{})


		users.forEach(async (element)=>{

			var ClassroomStudent = new classroomStudent({
				group:req.body.group,
				classroom:classroom._id,
				student:element._id,
			})

			await ClassroomStudent.save()
		})
		
			

			var ponderation = new Ponderation({
				classroomId:classroom._id,
			})

			await ponderation.save()

		res.status(200).redirect('/assignTeacher')
	}catch(err){
		res.json({ message : err })
	}	
})

router.get('/searchSubjects', async (req,res) => {
	try{
		const token = req.body.jwt
		const tokenData = await verifyToken(token)

		const group = await userStudent.findById(tokenData.uid,{password:0,registerNumber:0,role:0,_id:0,firstTimeLogged:0})
		const subjects = await Classroom.find({group:group.group})
	
		res.status(200).json(subjects)
	}catch(err){
		res.json({ message : err })
	}	
})

router.get('/searchTeacherSubjects', async (req,res) => {
	try{
		const token = req.body.jwt
		const tokenData = await verifyToken(token)
		console.log(tokenData)
		const subjects = await Classroom.find({teacher:tokenData.uid})
	
		res.status(200).json(subjects)
	}catch(err){
		res.json({ message : err })
	}	
})

router.get('/', async (req,res) => {
	try{
		
		const subjects = await Classroom.find({})
	
		res.status(200).json(subjects)
	}catch(err){
		res.json({ message : err })
	}	
})

router.get('/searchKardex', async (req,res) => {
	try{
		const token = req.body.jwt
		const tokenData = await verifyToken(token)
		

		const grades = await classroomStudent.find({student:tokenData.uid},{})
		console.log(grades)	

		res.status(200).json(classroomStudent)
	}catch(err){
		res.json({ message : err })
	}	
})

router.get('/:group', async (req,res) => {
	try{
	console.log("Grupo"+req.params.group)
		const subjects = await Classroom.find({group:req.params.group},{teacher:0})
	
		res.status(200).json(subjects)
	}catch(err){
		res.json({ message : err })
	}	
})


module.exports = router
