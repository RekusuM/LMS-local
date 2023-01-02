const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')

const Assignment = require('../models/assignment')
const verifyToken = require('../services/verifyToken')
const classroomStudent = require('../models/classroomStudent')

const Publications = require('../models/publication')
const UserStudent = require('../models/userStudent')
const upload = multer({ dest: 'uploads/'})

router.post('/',upload.array('files', 4), async (req,res) => {
	const token = req.cookies.jwt
	const tokenData = await verifyToken(token)

	const user = await  UserStudent.findById(tokenData.uid,{career:1,registerNumber:1})
	console.log(user)
	//class is equal to the assignmentId
	const assignment = new Assignment({
			registerId:tokenData.uid,
			register:user.registerNumber,
			class:req.body.assignment,
			date: new Date()
	})

	if(req.files){
		req.files.forEach(function(files,index){
			assignment.files[index] = {
				data:fs.readFileSync(req.files[index].path),
				contentType:req.files[index].mimetype,
				name:req.files[index].originalname
			}	
		})
	}


	try{
		await assignment.save()

		res.status(200).redirect("/publicationsOne?publicationId="+req.body.assignment)

	}catch(err){
		
		res.json({ message : err })

	}
})

router.get('/', async (req,res)=>{
	try{
		console.log(req.body.assignment)
		
		const homeworks = await Assignment.find({class:req.body.assignment},{"files.data":0})
		res.status(200).json(homeworks)
	}catch(err){
		res.json({ message : err })
	}
})



router.get('/:user/:publicationId', async (req,res)=>{
	try{
		const homeworks = await Assignment.findOne({register:req.params.user, class:req.params.publicationId},{"files.data":0})
		res.status(200).json(homeworks)
	}catch(err){
		res.json({ message : err })
	}
})

router.get('/getHomework', async (req,res)=>{
	try{
		const token = req.body.jwt
		const tokenData = await verifyToken(token)

		const homeworks = await Assignment.findOne({registerId:tokenData.uid, class:req.body.publicationId},{"files.data":0})
		console.log(homeworks)	
		res.status(200).json(homeworks)

	}catch(err){
		res.json({ message : err })
	}
})





router.post('/grade', async (req,res)=>{
	try{
		console.log(req.body)
		if(Array.isArray(req.body.grade)){
			let grade = 0 
			for(var i=0; i< req.body.grade.length; i++){
				grade = parseInt(req.body.grade[i],10) + grade
			}	
			
			const homeworks = await Assignment.findOneAndUpdate({register:req.body.register, class: req.body.assignment},{grade:grade, graded:true})
		}else{
			console.log("aqui entro")	
			const homeworks = await Assignment.findOneAndUpdate({register:req.body.register, class:req.body.assignment },{grade:req.body.grade, graded:true})
			console.log(homeworks)
		}
		res.status(200).redirect("/checkHomework?publicationId="+req.body.assignment)
	}catch(err){
		res.json({ message : err })
	}
})


router.get('/files/get/:homeworkId', async (req,res)=>{
	try{
		const homework = await Assignment.findOne({ "files._id": req.params.homeworkId},{"files" : 1})

		homework.files.forEach(function(files,index){

			if(homework.files[index]._id==req.params.homeworkId){
				res.setHeader("Content-Type",homework.files[index].contentType)	
				res.setHeader("Content-Disposition","inline; filename="+homework.files[index].name)
				res.send(homework.files[index].data)
			}

		})
	}catch(err){
		res.json({ message : err })
	}
})

router.get('/userHomework', async (req,res)=>{
	try{
		const token = req.cookies.jwt
		const tokenData = await verifyToken(token)
		const group = await  UserStudent.findById(tokenData.uid,{group:1})
		const classroom = await  classroomStudent.findOne({student: tokenData.uid,group:group.group},{classroom:1})
		const homework = await Publications.find({ class:classroom.classroom,assignation:true},{title:1,deliveryDate:1})
		console.log(homework)
		res.json(homework)
			
	}catch(err){
		res.json({ message : err })
	}
})
router.get('/role', async (req,res)=>{
	try{
		const token = req.body.jwt
		const tokenData = await verifyToken(token)
		const role = await  UserStudent.findById(tokenData.uid,{role:1})
		res.json(role)
			
			
	}catch(err){
		res.json({ message : err })
	}
})
module.exports = router
