const express = require('express')
const router = express.Router()
const axios = require('axios')
const checkAuth = require('../services/auth')
const { v4: uuidV4 } = require('uuid')

//videocall
router.get('/videochat', (req, res) => {
	res.redirect(`/videochat/${uuidV4()}`)
})

router.get('/videochat/:room', (req, res) => {
	function getSchedule() {
	  return axios.get("https://localhost:3000/api/assistance",{data:{ jwt:req.cookies.jwt, room:req.params.room}});
	}
	
	Promise.all([getSchedule()])
	  .then(function (results) {
		const jwt = results[0].data;
		console.log(jwt)	
		res.render('videocall', { roomId: req.params.room, user:jwt.username })
	});

})
//videocall ends
router.get('/login',(req,res)=>{
    	res.render('login')
})

router.get('/changePassword',(req,res)=>{
    	res.render('changepwd')
})

router.get('/postulationForm',(req,res)=>{
    	res.render('postulation_form')
})

router.get('/kardex',checkAuth(['student']),(req,res)=>{

	function getSchedule() {
	  return axios.get("https://localhost:3000/api/grade/kardex",{data:{ jwt:req.cookies.jwt}});
	}
	
	Promise.all([getSchedule()])
	  .then(function (results) {
	    const kardex = results[0].data;
	
	    res.render('grades',{kardex: kardex})
	});
})
router.get('/grades',checkAuth(['student']),(req,res)=>{
	//checar que agarre params
	function getSchedule() {
	  return axios.get("https://localhost:3000/api/grade/subjects",{data:{ jwt:req.cookies.jwt, classroom:req.query.classroomId}});
	}
	
	Promise.all([getSchedule()])
	  .then(function (results) {
	    const grades = results[0].data;
		  console.log(grades)
	    res.render('gradesSubject',{kardex: grades})
	});req.params.user
})
router.get('/schedule',checkAuth(['student','teacher']),(req,res)=>{

	function getSchedule() {
	  return axios.get("https://localhost:3000/api/assignSchedule",{data:{ jwt:req.cookies.jwt}});
	}

	
	Promise.all([getSchedule()])
	  .then(function (results) {
	    const schedule = results[0].data;

	    res.render('schedule',{schedule: schedule})
	});
})
router.get('/scheduleTeacher',checkAuth(['teacher']),(req,res)=>{

	function getSchedule() {
	  return axios.get("https://localhost:3000/api/assignSchedule/teacherSchedule",{data:{ jwt:req.cookies.jwt}});
	}

	
	Promise.all([getSchedule()])
	  .then(function (results) {
	    const schedule = results[0].data;

	    res.render('schedule',{schedule: schedule})
	});
})
router.get('/subjects',(req,res)=>{
 
	let url = "https://localhost:3000/api/classrooms/searchSubjects"

	axios.get(url, {
		data: { jwt:req.cookies.jwt 
		}
  	})
	.then(function (response) {
		const publication = response.data
		res.render('subjects',{publication: publication})
  	})
  	.catch(function (error) {
   		console.log(error);
  	})
  	.finally(function () {
  	  // always executed
  	});
})

router.get('/subjectsTeacher',(req,res)=>{

	let url = "https://localhost:3000/api/classrooms/searchTeacherSubjects"

	axios.get(url, {
		data: { jwt:req.cookies.jwt 
		}
  	})
	.then(function (response) {
		const publication = response.data
		res.render('subjectTeacher',{publication: publication})
  	})
  	.catch(function (error) {
   		console.log(error);
  	})
  	.finally(function () {
  	  // always executed
  	});
})

router.get('/publicationsTeachers',(req,res)=>{
 
	let url = "https://localhost:3000/api/publication"
	axios.get(url, {
		data: {
			publicationId:req.query.publicationId
		}
	})
	.then(function (response) {
		const publication = response.data
		res.render('publicationsTeacher',{publication: publication})
  	})
  	.catch(function (error) {
   		console.log(error);
  	})
  	.finally(function () {
  	  // always executed
  	});
})

router.get('/publications',(req,res)=>{
 
	let url = "https://localhost:3000/api/publication"
	axios.get(url, {
		data: {
			publicationId:req.query.publicationId
		}
	})
	.then(function (response) {
		const publication = response.data
		res.render('publications',{publication: publication})
  	})
  	.catch(function (error) {
   		console.log(error);
  	})
  	.finally(function () {
  	  // always executed
  	});
})

router.get('/publicationsOne',(req,res)=>{
 
	function getCriteria() {
	  return axios.get('https://localhost:3000/api/publication/one',{data:{ publicationId:req.query.publicationId}});
	}

	function getHomework() {
	  return axios.get('https://localhost:3000/api/assignment/getHomework',{data:{ publicationId:req.query.publicationId, jwt:req.cookies.jwt}});
	}


	Promise.all([getCriteria(),getHomework()])
	  .then(function (results) {
	    const publication = results[0].data;
	    const homework = results[1].data	
	    
		res.render('onePublication',{publication: publication, homework:homework})
	});


})

router.get('/template',(req,res)=>{

	    res.render('template',)

})


router.get('/templateModify',(req,res)=>{
	console.log(req.query)
	function getPublications() {
	  return axios.get('https://localhost:3000/api/template',{data:{ templateCode:req.query.templateCode,currentClassroom:req.query.currentClassroom}});
	}


	Promise.all([getPublications()])
	  .then(function (results) {
	    const publications = results[0].data;

	    
		res.render('templateModify',{publications: publications})
	});

})





router.get('/createPublication',(req,res)=>{


//cambiar esto por id de salon
	function getCriteria() {
	  return axios.get('https://localhost:3000/api/ponderation/',{data:{ classroomId:req.query.classroom}});
	}

	
	Promise.all([getCriteria()])
	  .then(function (results) {
	    const categories = results[0].data;
		
	    
	    res.render('homeworkCreation',{categories: categories})
	});

})


router.get('/calendar',checkAuth(['student','teacher']),(req,res)=>{
	function getAllHomeworks() {
	  return axios.get('https://localhost:3000/api/assignment/role',{data:{ jwt:req.cookies.jwt}});
		
	}
	
	Promise.all([getAllHomeworks()])
	  .then(function (results) {
	    const role = results[0].data;
	    res.render('calendar',{role: role})
	});

})

router.get('/checkHomework',checkAuth(['teacher']),(req,res)=>{
	function getFilesAndUsers() {
	  return axios.get('https://localhost:3000/api/assignment/',{data:{ assignment:req.query.publicationId}});
	}
	function getCriteria() {
	  return axios.get('https://localhost:3000/api/publication/one',{data:{ publicationId:req.query.publicationId}});
		
	}
	
	Promise.all([getFilesAndUsers(), getCriteria()])
	  .then(function (results) {
	    const filesAndUsers = results[0].data;
	    const criteria = results[1].data;
		
	   console.log("files and users:") 
	   console.log(filesAndUsers) 
	    res.render('checkHomework',{filesAndUsers: filesAndUsers, criteria:criteria})
	});
})

router.get('/checkHomeworkTable/:user/:publicationId',checkAuth(['teacher']),(req,res)=>{
	function getFiles() {
	  return axios.get('https://localhost:3000/api/assignment/'+req.params.user+'/'+req.params.publicationId);
	}
	
	Promise.all([getFiles()])
	  .then(function (results) {
	    const files = results[0].data;
	    console.log(files)
	    res.render('include/_checkHomeworkTable',{files: files})
	});
})






//GENERAL ADMIN ROUTES

router.get('/postulates',checkAuth(['admin']),(req,res)=>{


	let url = "https://localhost:3000/api/postulate"
	
	axios.get(url, {
    		params: {
    		}
  	})
	.then(function (response) {
    		console.log(response.data);
		res.render('postulateTable',{postulates: response.data})
  	})
  	.catch(function (error) {
   		console.log(error);
  	})
  	.finally(function () {
  	  // always executed
  	});
})

router.get('/assignGroups',checkAuth(['admin']),(req,res)=>{
	function getUsers() {
	  return axios.get('https://localhost:3000/api/groups');
	}
	
	function getAllGroups() {
	  return axios.get('https://localhost:3000/api/groups/all');
	}
	function getAllClassrooms() {
	  return axios.get('https://localhost:3000/api/classrooms');
	}
	Promise.all([getUsers(), getAllGroups(),])
	  .then(function (results) {
	    const students = results[0].data;
	    const groups = results[1].data;
	    res.render('studentGroupAssignation',{students: students, groups:groups})
	});

})

router.get('/drop',checkAuth(['admin']),(req,res)=>{
	function getUsers() {
	  return axios.get('https://localhost:3000/api/drop');
	}
	
	Promise.all([getUsers()])
	  .then(function (results) {
	    const students = results[0].data;
	    res.render('dropped',{students: students})
	});

})

router.get('/assignDate',(req,res)=>{
    	res.render('assignDates')
})

//CAREER ADMIN ROUTES

router.get('/assignSchedule',checkAuth(['adminC']), (req,res)=>{
	
	function getAllGroups() {
	  return axios.get('https://localhost:3000/api/groups/all');
	}
	
	Promise.all([getAllGroups()])
	  .then(function (results) {
	    
	    const groups = results[0].data;

	    res.render('assignSchedule',{groups:groups})
	});

})

router.get('/assignScheduleTable/:group',checkAuth(['adminC']),(req,res)=>{
	function getGroupClassrooms() {
	  return axios.get('https://localhost:3000/api/classrooms/'+req.params.group);
	}
	function getAllSubjects() {
	  return axios.get('https://localhost:3000/api/subjects');
	}
	Promise.all([getGroupClassrooms(),getAllSubjects()])
	  .then(function (results) {
	    
	    const classrooms = results[0].data;
	    const subjects = results[1].data;

	    res.render('include/_assignScheduleTable',{classrooms:classrooms, subjects:subjects})
	});

})

router.get('/assignTeacher',checkAuth(['adminC']),(req,res)=>{
	function getUsers() {
	  return axios.get('https://localhost:3000/api/teachers',{data:{jwt:req.cookies.jwt}});
	}
	function getAllGroups() {
	  return axios.get('https://localhost:3000/api/groups/all');
	}	
	function getSubjects() {
	  return axios.get('https://localhost:3000/api/subjects',{data:{jwt:req.cookies.jwt}});
	}
	
	Promise.all([getUsers(), getAllGroups(), getSubjects()])
	  .then(function (results) {
	    const teachers = results[0].data;
	    const groups = results[1].data;
	    const subjects = results[2].data;
	    res.render('assignTeacher',{teachers: teachers, groups:groups, subjects:subjects})
	});

})
router.get('/createSubject',checkAuth(['adminC']),(req,res)=>{
    	
	res.render('createSubject')
})
//Exports for use in server.js
module.exports = router
