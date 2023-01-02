const express = require('express')
const router = express.Router()

const verifyToken = require('../services/verifyToken')
const classroomStudent = require('../models/classroomStudent')
const Assignment = require('../models/assignment')
const Publication = require('../models/publication')
const Ponderation = require('../models/classroomPonderation')

const Classroom = require('../models/classroom')

const Subject = require('../models/subjects')

router.get('/firstPartial', async (req,res) => {
	try{
		const classrooms = await classroomStudent.find({ coursing:true })
		
		classrooms.forEach(async (classroom)=>{
			//pido todas las tareas de la materia
			const homeworks = await Publication.aggregate([
			  {
			    '$match': {
			      'class': classroom.classroom, 
			      'assignation': true,
			    }
			  }, {
			    '$addFields': {
			      'idpublicacion': {
			        '$toString': '$_id'
			      }
			    }
			  }, {
			    '$lookup': {
			      'from': 'assignments', 
			      'localField': 'idpublicacion', 
			      'foreignField': 'class', 
			      'as': 'tareas'
			    }
			  }, {
			    '$unwind': {
			      'path': '$tareas', 
			      'preserveNullAndEmptyArrays': true
			    }
			  }, {
			    '$replaceRoot': {
			      'newRoot': {
			        '$mergeObjects': [
			          '$$ROOT', '$tareas'
			        ]
			      }
			    }
			  }, {
			    '$match': {
			      'registerId': classroom.student, 
			      'graded': true,
			      'ponderated':false
			    }
			  }, {
			    '$project': {
			      '_id': 1, 
			      'title': 1, 
			      'category': 1, 
			      'criteria': 1, 
			      'ponderation': 1, 
			      'register': 1, 
			      'registerId': 1, 
			      'grade': 1, 
			      'graded': 1
			    }
			  }
			])


			const ponderations = await Ponderation.findOne({classroomId:classroom.classroom})
			//custom
			ponderations.ponderations.forEach(async (ponderation)=>{
				let categoryGrade=0
				let categoryCount=0
				//checks homeworks
				homeworks.forEach((homework)=>{

					if(!homework.ponderation){
						//if it uses category
						if(ponderation.name==homework.category){
							categoryGrade= homework.grade+categoryGrade
							categoryCount++
						}
					}					
				})
				categoryGrade=categoryGrade/categoryCount

				categoryGrade=categoryGrade*ponderation.ponderation/100
				if(isNaN(categoryGrade)){
					categoryGrade=0
				}

				await classroomStudent.findByIdAndUpdate(classroom._id,{
					$push:{
						firstPartialGrades:{
							grade: categoryGrade,
							category: ponderation.name
						}
					}
				})	
			})
			//Strict 
			homeworks.forEach(async (homework)=>{

				let categoryGrade=0
				
				await Assignment.findByIdAndUpdate(homework._id,{ponderated:true})

				if(homework.ponderation){
					//if it uses category
					categoryGrade= homework.grade*homework.ponderation/100

					await classroomStudent.findByIdAndUpdate(classroom._id,{
						$push:{
							firstPartialGrades:{
								grade: categoryGrade,
								category: homework.title
							}
						}
					})	
				}				
			})	


		})
	
		res.status(200).json(subjects)
	}catch(err){
		res.json({ message : err })
	}	
})


router.get('/firstPartialFinal', async (req,res) => {

		const classrooms = await classroomStudent.find({ coursing:true })

		classrooms.forEach(async (classroom)=>{
            		console.log(classroom)


                	let partialGrade=0

                	classroom.firstPartialGrades.forEach(criteria=>{
                	    console.log(criteria.grade)
                	    partialGrade=partialGrade+ parseFloat(criteria.grade) 

                	})

                	await classroomStudent.findByIdAndUpdate(classroom._id,{
                	        $push:{
                	        partialGrades:{
                	            grade: partialGrade,
                	        }
                	    }
                	})
		})
	try{
					res.status(200).json(subjects)
	}catch(err){
		res.json({ message : err })
	}	

})


router.get('/secondPartial', async (req,res) => {
	try{
		const classrooms = await classroomStudent.find({ coursing:true })
		
		classrooms.forEach(async (classroom)=>{
			//pido todas las tareas de la materia
			const homeworks = await Publication.aggregate([
			  {
			    '$match': {
			      'class': classroom.classroom, 
			      'assignation': true,
			    }
			  }, {
			    '$addFields': {
			      'idpublicacion': {
			        '$toString': '$_id'
			      }
			    }
			  }, {
			    '$lookup': {
			      'from': 'assignments', 
			      'localField': 'idpublicacion', 
			      'foreignField': 'class', 
			      'as': 'tareas'
			    }
			  }, {
			    '$unwind': {
			      'path': '$tareas', 
			      'preserveNullAndEmptyArrays': true
			    }
			  }, {
			    '$replaceRoot': {
			      'newRoot': {
			        '$mergeObjects': [
			          '$$ROOT', '$tareas'
			        ]
			      }
			    }
			  }, {
			    '$match': {
			      'registerId': classroom.student, 
			      'graded': true,
			      'ponderated':false
			    }
			  }, {
			    '$project': {
			      '_id': 1, 
			      'title': 1, 
			      'category': 1, 
			      'criteria': 1, 
			      'ponderation': 1, 
			      'register': 1, 
			      'registerId': 1, 
			      'grade': 1, 
			      'graded': 1
			    }
			  }
			])


			const ponderations = await Ponderation.findOne({classroomId:classroom.classroom})
			//custom
			ponderations.ponderations.forEach(async (ponderation)=>{
				let categoryGrade=0
				let categoryCount=0
				//checks homeworks
				homeworks.forEach((homework)=>{

					if(!homework.ponderation){
						//if it uses category
						if(ponderation.name==homework.category){
							categoryGrade= homework.grade+categoryGrade
							categoryCount++
						}
					}					
				})
				categoryGrade=categoryGrade/categoryCount

				categoryGrade=categoryGrade*ponderation.ponderation/100
				if(isNaN(categoryGrade)){
					categoryGrade=0
				}

				await classroomStudent.findByIdAndUpdate(classroom._id,{
					$push:{
						secondPartialGrades:{
							grade: categoryGrade,
							category: ponderation.name
						}
					}
				})	
			})
			//Strict 
			homeworks.forEach(async (homework)=>{

				let categoryGrade=0
				
				await Assignment.findByIdAndUpdate(homework._id,{ponderated:true})

				if(homework.ponderation){
					//if it uses category
					categoryGrade= homework.grade*homework.ponderation/100

					await classroomStudent.findByIdAndUpdate(classroom._id,{
						$push:{
							secondPartialGrades:{
								grade: categoryGrade,
								category: homework.title
							}
						}
					})	
				}				
			})	


		})
	
		res.status(200).json(subjects)
	}catch(err){
		res.json({ message : err })
	}	
})

router.get('/secondPartialFinal', async (req,res) => {

		const classrooms = await classroomStudent.find({ coursing:true })

		classrooms.forEach(async (classroom)=>{
            		console.log(classroom)


                	let partialGrade=0

                	classroom.secondPartialGrades.forEach(criteria=>{
                	    console.log(criteria.grade)
                	    partialGrade=partialGrade+ parseFloat(criteria.grade) 

                	})

                	await classroomStudent.findByIdAndUpdate(classroom._id,{
                	        $push:{
                	        partialGrades:{
                	            grade: partialGrade,
                	        }
                	    }
                	})
		})
	try{
					res.status(200).json(subjects)
	}catch(err){
		res.json({ message : err })
	}	

})

router.get('/thirdPartial', async (req,res) => {
	try{
		const classrooms = await classroomStudent.find({ coursing:true })
		
		classrooms.forEach(async (classroom)=>{
			//pido todas las tareas de la materia
			const homeworks = await Publication.aggregate([
			  {
			    '$match': {
			      'class': classroom.classroom, 
			      'assignation': true,
			    }
			  }, {
			    '$addFields': {
			      'idpublicacion': {
			        '$toString': '$_id'
			      }
			    }
			  }, {
			    '$lookup': {
			      'from': 'assignments', 
			      'localField': 'idpublicacion', 
			      'foreignField': 'class', 
			      'as': 'tareas'
			    }
			  }, {
			    '$unwind': {
			      'path': '$tareas', 
			      'preserveNullAndEmptyArrays': true
			    }
			  }, {
			    '$replaceRoot': {
			      'newRoot': {
			        '$mergeObjects': [
			          '$$ROOT', '$tareas'
			        ]
			      }
			    }
			  }, {
			    '$match': {
			      'registerId': classroom.student, 
			      'graded': true,
			      'ponderated':false
			    }
			  }, {
			    '$project': {
			      '_id': 1, 
			      'title': 1, 
			      'category': 1, 
			      'criteria': 1, 
			      'ponderation': 1, 
			      'register': 1, 
			      'registerId': 1, 
			      'grade': 1, 
			      'graded': 1
			    }
			  }
			])


			const ponderations = await Ponderation.findOne({classroomId:classroom.classroom})
			//custom
			ponderations.ponderations.forEach(async (ponderation)=>{
				let categoryGrade=0
				let categoryCount=0
				//checks homeworks
				homeworks.forEach((homework)=>{

					if(!homework.ponderation){
						//if it uses category
						if(ponderation.name==homework.category){
							categoryGrade= homework.grade+categoryGrade
							categoryCount++
						}
					}					
				})
				categoryGrade=categoryGrade/categoryCount

				categoryGrade=categoryGrade*ponderation.ponderation/100
				if(isNaN(categoryGrade)){
					categoryGrade=0
				}

				await classroomStudent.findByIdAndUpdate(classroom._id,{
					$push:{
						thirdPartialGrades:{
							grade: categoryGrade,
							category: ponderation.name
						}
					}
				})	
			})
			//Strict 
			homeworks.forEach(async (homework)=>{

				let categoryGrade=0
				
				await Assignment.findByIdAndUpdate(homework._id,{ponderated:true})

				if(homework.ponderation){
					//if it uses category
					categoryGrade= homework.grade*homework.ponderation/100

					await classroomStudent.findByIdAndUpdate(classroom._id,{
						$push:{
							thirdPartialGrades:{
								grade: categoryGrade,
								category: homework.title
							}
						}
					})	
				}				
			})	


		})
	
		res.status(200).json(subjects)
	}catch(err){
		res.json({ message : err })
	}	
})

router.get('/thirdPartialFinal', async (req,res) => {

		const classrooms = await classroomStudent.find({ coursing:true })

		classrooms.forEach(async (classroom)=>{
            		console.log(classroom)


                	let partialGrade=0

                	classroom.thirdPartialGrades.forEach(criteria=>{
                	    console.log(criteria.grade)
                	    partialGrade=partialGrade+ parseFloat(criteria.grade) 

                	})

                	await classroomStudent.findByIdAndUpdate(classroom._id,{
                	        $push:{
                	        partialGrades:{
                	            grade: partialGrade,
                	        }
                	    }
                	})
		})
	try{
					res.status(200).json(subjects)
	}catch(err){
		res.json({ message : err })
	}	

})

router.get('/endSemester', async (req,res) => {

		const classrooms = await classroomStudent.find({ coursing:true })

		classrooms.forEach(async (classroom)=>{
            		console.log(classroom)


			const classroomSubject = await Classroom.findById(classroom.classroom,{subject:1})


			const ponderation = await Subject.findOne({name:classroomSubject.subject},{weight:1})	
			
			console.log(ponderation)

                	let semesterGrade=0

			classroom.partialGrades.forEach(criteria=>{
                		semesterGrade=semesterGrade+ parseFloat(criteria.grade) 
                	})


			switch(ponderation.weight) {
			  case "A":
				semesterGrade=((classroom.partialGrades[0].grade*20)/100)+((classroom.partialGrades[1].grade*35)/100)+((classroom.partialGrades[2].grade*45)/100)
			    break;
			  case "B":

				semesterGrade=((classroom.partialGrades[0].grade*15)/100)+((classroom.partialGrades[1].grade*35)/100)+((classroom.partialGrades[2].grade*50)/100)
			    break;
			  case "C":
			    
				semesterGrade=((classroom.partialGrades[0].grade*33)/100)+((classroom.partialGrades[1].grade*33)/100)+((classroom.partialGrades[2].grade*34)/100)
			    break;
			  default:
			} 

				console.log(semesterGrade)	

                	await classroomStudent.findByIdAndUpdate(classroom._id,{finalGrade:semesterGrade})
			if(semesterGrade>=70){
                		await classroomStudent.findByIdAndUpdate(classroom._id,{passed:true,coursing:false})
			}else{
                		await classroomStudent.findByIdAndUpdate(classroom._id,{passed:false,coursing:false})
			}
		})
	try{
					res.status(200).json(subjects)
	}catch(err){
		res.json({ message : err })
	}	

})


router.get('/kardex', async (req,res) => {
		const token = req.body.jwt
		const tokenData = await verifyToken(token)
		const classrooms = await classroomStudent.aggregate([
			  {
			    '$match': {
			      'student': tokenData.uid
			    }
			  }, {
			    '$project': {
			      'student': 1, 
			      'partialGrades': 1, 
			      'finalGrade': 1, 
			      'group': 1
			    }
			  }, {
			    '$lookup': {
			      'from': 'classrooms', 
			      'localField': 'group', 
			      'foreignField': 'group', 
			      'as': 'subject'
			    }
			  }, {
			    '$project': {
			      'subject.teacher': 0, 
			      'subject.group': 0, 
			      'subject._id': 0
			    }
			  }
			])
	try{
		res.status(200).json(classrooms)
	}catch(err){
		res.json({ message : err })
	}	

})
router.get('/subjects', async (req,res) => {
		const token = req.body.jwt
		const tokenData = await verifyToken(token)
		const classrooms = await classroomStudent.aggregate([
			  {
			    '$match': {
			      'student': tokenData.uid,
			      'classroom':req.body.classroom 
			    }
			  },
			{'$project': {
			      'partialGrades': 1, 
			      'firstPartialGrades': 1, 
			      'secondPartialGrades': 1, 
			      'thirdPartialGrades': 1 
			    }
			  }
			])
		

	try{
		res.status(200).json(classrooms)
	}catch(err){
		res.json({ message : err })
	}	

})
module.exports = router

