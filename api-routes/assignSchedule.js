const express = require('express')
const router = express.Router()

const Classroom = require('../models/classroom')
const Groups = require('../models/groups')
const Hours = require('../models/subjects')
const userStudent = require('../models/userStudent')
const verifyToken = require('../services/verifyToken')

router.post('/', async (req,res) => {
	try{
		const subjects = await Classroom.find({group:req.body.group},{teacher:0})
		let hourCount=0
		let correctSchedule=true
		for (let i = 0; i < subjects.length; i++) {
			const hoursPerWeek = await Hours.findOne({name:subjects[i].subject},{hoursPerWeek:1})

			for (let o = 0; o < req.body.hourSelect.length; o++) {
				if(req.body.hourSelect[o]==subjects[i].subject){
					hourCount++
					console.log(hourCount)
				}
			}

			if(hourCount!=hoursPerWeek.hoursPerWeek){
				correctSchedule=false
			}else{	
				hourCount=0
			}
		}
		
		if(correctSchedule==true){
			console.log("entro")
			const schedule = await Groups.findOneAndUpdate({group:req.body.group}, {schedule:req.body.hourSelect});
			res.redirect("/assignSchedule")
		}else{
			res.send('<p>Se ingreso incorrectamente el horario</p>')
		}
	}catch(err){
		res.json({ message : err })
	}	
})

router.get('/', async (req,res) => {
	try{
		const token = req.body.jwt
		const tokenData = await verifyToken(token)
		const group = await userStudent.findById(tokenData.uid,{password:0,registerNumber:0,role:0,_id:0,firstTimeLogged:0})

		const schedule = await Groups.findOne({group:group.group});
		res.json(schedule)
	}catch(err){
		res.json({ message : err })
	}	
})

router.get('/teacherSchedule', async (req,res) => {
	try{
		const token = req.body.jwt
		const tokenData = await verifyToken(token)

	const teacherSchedule = await Classroom.aggregate([
		  {
		    '$match': {
		      'teacher': '6386e10775171e346444f72e'
		    }
		  }, {
		    '$lookup': {
		      'from': 'groups', 
		      'localField': 'group', 
		      'foreignField': 'group', 
		      'as': 'schedule'
		    }
		  }, {
		    '$project': {
		      'teacher': 0
		    }
		  }
		])
	let finalTeacherSchedule=new Array(45)
	let finalTeacherVideoCalls=new Array(45)
	teacherSchedule.forEach((classroom)=>{
			console.log(classroom)
		classroom.schedule.forEach((schedule)=>{
			
			schedule.schedule.forEach((hour,index)=>{
				console.log(hour)
				if(classroom.subject==hour){
					finalTeacherSchedule[index]= classroom.subject
					finalTeacherVideoCalls[index]= schedule.videoCalls[index]
				}
		
			})
		})
	})

		let completeSchedule={
			schedule:finalTeacherSchedule,
			videoCalls:finalTeacherVideoCalls
		}
		res.json(completeSchedule)
	}catch(err){
		res.json({ message : err })
	}	
})

module.exports = router
