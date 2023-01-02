const express = require('express')
const router = express.Router()
const classroomStudent = require('../models/classroomStudent')
const userStudent = require('../models/userStudent')


router.get('/verification', async (req,res) => {

		const allStudents = await userStudent.find({droped:false})

		allStudents.forEach(async student=>{
			
			const classrooms = await classroomStudent.find({ student:student._id })
			let subjectsnotPassed = 0 
			let promote = true
			classrooms.forEach(async (classroom)=>{
				
				if(classroom.passed==false){
					subjectsnotPassed++
				}
				let classroomGroup=parseInt(classroom.group.substring(0, 1))
			
				console.log(classroomGroup)	
				console.log(student.group.substring(0, 1))
				console.log(student._id)
				if(classroomGroup==parseInt(student.group.substring(0, 1))-1){

					if(classroom.passed==false){
						console.log("entro a baja por irregular")
						const students = await userStudent.findByIdAndUpdate(student._id,{droped:"true"})
						promote=false
					}
				}
			
			})

			if(subjectsnotPassed>6){
				console.log("entro")
				promote=false
				const students = await userStudent.findOneAndUpdate({"_id":student._id},{droped:"true"})
			}


			if(subjectsnotPassed>3){
				promote=false
			}
			if(promote){
				const group = student.group.substring(1,3)
				const semester =  parseInt(student.group.substring(0,1))+1
				const newGroup = semester.toString()+group
				const students = await userStudent.findOneAndUpdate({"_id":student._id},{group:newGroup})
			}

		})

	try{
		res.status(200).json(subjects)
	}catch(err){
		res.json({ message : err })
	}	

})

module.exports = router
