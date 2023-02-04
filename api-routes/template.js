const express = require('express')
const router = express.Router()
const Publication = require('../models/publication')
const Ponderation = require('../models/classroomPonderation')

router.get('/',async (req,res)=>{
	console.log(req.body)
	const publication = await Publication.find({class:req.body.templateCode},{files:0,content:0,class:0,criteria:0,category:0,publicationDate:0})
	console.log(publication)

	res.json(publication)
})

router.post('/',async (req,res)=>{
	console.log(req.body)


	const ponderation = await Ponderation.findOne({classroomId:req.body.templateCode})
	console.log(ponderation)
	ponderation.ponderations.forEach(async (ponderation)=>{
		await Ponderation.findOneAndUpdate({classroomId:req.body.idCurrentClassroom},{
			$push:{

				ponderations:{
					name: ponderation.name,
					ponderation: ponderation.ponderation


				}
			}
		})
	})



	

		req.body.publicationId.forEach(async (publicationId,index)=>{
		
		const publication = await Publication.findById(publicationId)

		const newPublication = new Publication({
				title:publication.title,
				content:publication.content,
				class:req.body.idCurrentClassroom,
				assignation:publication.assignation,
				deliveryDate:req.body.deliveryDate[index]	
		})
		if(publication.files){
			publication.files.forEach(function(files,index){
				newPublication.files[index] = {
					data:publication.files[index].data,
					contentType:publication.files[index].contentType,
					name:publication.files[index].name
				}
			})
		}

		if(publication.category){
			newPublication.category = publication.category
		}
		if(publication.ponderation){
				newPublication.ponderation = publication.ponderation	
		}
		if(publication.ytLink){
				newPublication.ytLink = publication.ytLink	
		}
		if(publication.criteria){
			if(!Array.isArray(publication.criteria)){
				newPublication.criteria[0] = {
					criteria:publication.criteria,
					weight:publication.weight
				}
		}else{	
			publication.criteria.forEach(function(files,index){
				newPublication.criteria[index] = {
					criteria:publication.criteria[index].criteria,
					weight:publication.criteria[index].weight
				}
			})
		}
		await newPublication.save()
	}	
	try{

		
		res.redirect("/publicationsTeachers?publicationId="+req.body.templateCode)
	}catch(err){
		
		res.json({ message : err })

	}

	})
})


module.exports = router
