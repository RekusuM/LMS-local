const express = require('express')
const router = express.Router()


const UserStudent = require('../models/userStudent')
const HashPassword = require('../services/encrypt')
const Login = require('../services/login')
const verifyToken = require('../services/verifyToken')

router.post('/', async (req,res) => {
	try{
		const user = await UserStudent.findOne({'registerNumber' :req.body.registerNumber})

		if(user==null){
			res.redirect('/login')
		}else{
			const jwt = await Login(req.body.password, user.password, user)
		
			if(jwt==false){
				res.redirect('/login')
			}else{		
				if(user.firstTimeLogged==false){
						
					res.status(200).cookie('jwt', jwt)
					res.redirect('/changePassword')
				}else{
					res.status(200).cookie('jwt', jwt)
					switch(user.role){
					case "student":
						res.redirect('/schedule')	
					break
					case "teacher":
						res.redirect('/subjectsTeacher')
					break
					case "admin":
						res.redirect('/postulates')	
					break
					case "adminC":
						res.redirect('/assignSchedule')	
					break
					}	
				}
			}
		}
	

	}catch(err){
		console.log(err)
		res.json({ message : err })
	}	
})

router.post('/password', async (req,res) => {
	try{

		const hashedPassword = await HashPassword(req.body.password)
		const token = req.cookies.jwt
		const tokenData = await verifyToken(token)

		const user = await  UserStudent.findByIdAndUpdate(
			tokenData.uid,
			{$set:{password: hashedPassword,firstTimeLogged:true}}
		)
	
		switch(user.role){
			case "student":			
				res.redirect('/schedule')	
			break
			case "teacher":
				res.redirect('/schedule')
			break
			case "admin":
				res.redirect('/postulates')	
			break
			case "adminC":
				res.redirect('/assignSchedule')	
			break
		}	
	
	}catch(err){
		res.json({ message : err })
	}	
})




module.exports = router
