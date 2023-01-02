const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')

const Publication = require('../models/publication')

const upload = multer({ dest: 'uploads/'})

router.post('/',upload.array('files', 4), async (req,res) => {
	console.log(req.body)	
	const publication = new Publication({
			title:req.body.title,
			content:req.body.content,
			class:req.body.class,
			assignation:req.body.assignation,
			deliveryDate:req.body.deliveryDate	
	})

	if(req.files){
		req.files.forEach(function(files,index){
			publication.files[index] = {
				data:fs.readFileSync(req.files[index].path),
				contentType:req.files[index].mimetype,
				name:req.files[index].originalname
			}
		})
	}
	if(req.body.category){
		publication.category = req.body.category
	}
	if(req.body.ponderation){
			publication.ponderation = req.body.ponderation	
	}
	if(req.body.ytLink){
			publication.ytLink = req.body.ytLink	
	}

	if(req.body.criteria){
		if(!Array.isArray(req.body.criteria)){
			publication.criteria[0] = {
				criteria:req.body.criteria,
				weight:req.body.weight
			}

		}else{	
			req.body.criteria.forEach(function(files,index){
				publication.criteria[index] = {
					criteria:req.body.criteria[index],
					weight:req.body.weight[index]
				}
			})
		}
	}	
	try{
		await publication.save()

		
		res.status(200).redirect("/publicationsTeachers?publicationId="+req.body.class)

	}catch(err){
		
		res.json({ message : err })

	}

})

router.get('/', async (req,res) => {
	
	try{
		const publication = await Publication.find({class:req.body.publicationId},{files:0,content:0})
		
		res.status(200).json(publication)

	}catch(err){
		
		res.json({ message : err })

	}

})


router.get('/one', async (req,res) => {
	
	try{
		const onePublication = await Publication.findById(req.body.publicationId,{ "files.data":0 })
		res.status(200).json(onePublication)

	}catch(err){
		
		res.json({ message : err })

	}

})
router.get('/files/:publicationId', async (req,res)=>{
	try{
		const onePublication = await Publication.findOne({ "files._id": req.params.publicationId},{"files" : 1})
		
		onePublication.files.forEach(function(files,index){

			if(onePublication.files[index]._id==req.params.publicationId){
				res.setHeader("Content-Type",onePublication.files[index].contentType)	
				res.setHeader("Content-Disposition","inline; filename="+onePublication.files[index].name)
				res.send(onePublication.files[index].data)
			}

		})
	}catch(err){
		res.json({ message : err })
	}
})
module.exports = router
