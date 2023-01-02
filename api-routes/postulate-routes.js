const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require("fs")
const Postulates = require('../models/postulates')

const storage = multer.diskStorage({
	destination:function (req, file, cb){
		cb(null,'uploads')
	},
	filename:(req, file, cb) =>{
		const uniqueSuffix = Date.now()+'-'+Math.round(Math.random()*1E9)
		cb(null, file.fieldname+'-'+uniqueSuffix)
	}
})

const upload = multer({ storage: storage})

const cpUpload = upload.fields([{ name: 'schoolCert', maxCount: 1 }, { name: 'curp', maxCount: 1 },{ name: 'antidoping', maxCount: 1 }, { name: 'birthdayCert', maxCount: 1 }])
// Adds a new postulate to the database
router.post('/', cpUpload, async (req,res) => {
	//creates a new postulate with the data in the request body
	const postulate = new Postulates({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		birthday: req.body.birthday,
		email: req.body.email,
		certHighschool:{
			contentType:req.files['schoolCert'][0].mimetype,
			data:fs.readFileSync(req.files['schoolCert'][0].path)
		},
		curp:{
			contentType:req.files['curp'][0].mimetype,
			data:fs.readFileSync(req.files['curp'][0].path)
		},
		antidoping:{
			contentType:req.files['antidoping'][0].mimetype,
			data:fs.readFileSync(req.files['antidoping'][0].path)
		},
		birthdayCert:{
			contentType:req.files['birthdayCert'][0].mimetype,
			data:fs.readFileSync(req.files['birthdayCert'][0].path)
		}

	})
	//Sends the data to the database or responds with error
	try{
		const savedPostulate = await postulate.save()
		res.redirect("/login")
		
	}catch(err){
		res.json({ message : err })
	}	
})

// Calls for all postulates in the database
router.get('/', async (req,res)=>{
	try{
		const postulates = await Postulates.find({},{birthdayCert:0,antidoping:0,curp:0,certHighschool:0})
		res.json(postulates)
	}catch(err){
		res.json({ message : err })
	}
})

router.get('/:postulateId', async (req,res)=>{
	try{
		const postulate = await Postulates.findById(req.params.postulateId)
		res.json({
			name:postulate.name,
			birthday:postulate.birthday,
			email:postulate.email
		})
	
	}catch(err){
		res.json({ message : err })
	}
})

router.get('/highschoolCertificate/:postulateId', async (req,res)=>{
	try{
		const postulateFile = await Postulates.findById(req.params.postulateId)
		res.setHeader("Content-Type",postulateFile.certHighschool.contentType)	
		res.setHeader("Content-Disposition","inline; filename=certificado.pdf")
		res.send(postulateFile.certHighschool.data)
	}catch(err){
		res.json({ message : err })
	}
})

router.get('/curp/:postulateId', async (req,res)=>{
	try{
		const postulateFile = await Postulates.findById(req.params.postulateId)
		res.setHeader("Content-Type",postulateFile.curp.contentType)	
		res.setHeader("Content-Disposition","inline; filename=certificado.pdf")
		res.send(postulateFile.curp.data)
		console.log("entro")
	}catch(err){
		res.json({ message : err })
	}
})

router.get('/antidoping/:postulateId', async (req,res)=>{
	try{
		console.log("entro")
		const postulateFile = await Postulates.findById(req.params.postulateId)
		res.setHeader("Content-Type",postulateFile.antidoping.contentType)	
		res.setHeader("Content-Disposition","inline; filename=certificado.pdf")
		res.send(postulateFile.antidoping.data)
	}catch(err){
		res.json({ message : err })
	}
})

router.get('/birthdayCertificate/:postulateId', async (req,res)=>{
	try{
		const postulateFile = await Postulates.findById(req.params.postulateId)
		res.setHeader("Content-Type",postulateFile.birthdayCert.contentType)	
		res.setHeader("Content-Disposition","inline; filename=certificado.pdf")
		res.send(postulateFile.birthdayCert.data)
	}catch(err){
		res.json({ message : err })
	}
})

router.delete('/:postulateId', async (req,res)=>{
	try{
		const deltePostulate = await Postulates.deleteOne({ _id : req.params.postulateId})
		res.json(deltePostulate)
	}catch(err){
		res.json({ message :err })
	}
})

module.exports = router
