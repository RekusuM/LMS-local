const express = require('express')
const router = express.Router()

const TimeAssignments = require('../models/timeAssignments')
const SetDates = require('../services/endsemester')
const FestiveDate = require('../models/festiveDates')

router.get('/', async (req,res) => {
	try{
		console.log("entro")
		const dates = await TimeAssignments.find()
		
		res.status(200).json(dates)

	}catch(err){
		res.json({ message : err })
	}	
})

router.post('/', async (req,res) => {
	try{
		console.log(req.body)
		const dates = new TimeAssignments({
			startSemester: req.body.startSemester,
			endSemester: req.body.endSemester,
			startFirstPartial: req.body.startFirstPartial,
			startSecondPartial: req.body.startSecondPartial,
			startThirdPartial: req.body.startThirdPartial,
		})
		SetDates(req.body.startFirstPartial,req.body.startSecondpartial,req.body.startThirdPartial, req.body.endSemester)

		console.log(dates)	
		const savedDate = await dates.save()

		res.status(200).redirect("/assignDate")

	}catch(err){
		res.json({ message : err })
	}	
})

router.patch('/', async (req,res) => {
	try{
		await TimeAssignments.findOneAndUpdate({},{
			startSemester: req.body.startSemester,
			endSemester: req.body.endSemester,
			startFirstPartial: req.body.startFirstPartial,
			startSecondPartial: req.body.startSecondPartial,
			startThirdPartial: req.body.startThirdPartial,
		})

		res.status(200).json(dates)

	}catch(err){
		res.json({ message : err })
	}	
})

router.post('/festiveDate', async (req,res) => {
	try{
		console.log(req.body)
		const festiveDate = new FestiveDate({
			event: req.body.event,
			date: req.body.date,
			color:req.body.color
		})
		
		const savedFestiveDate = await festiveDate.save()

		res.status(200).redirect("/assignDate")

	}catch(err){
		res.json({ message : err })
	}	
})

router.get('/festiveDate', async (req,res) => {
	try{

		const festiveDate = await FestiveDate.find()
		res.status(200).json(festiveDate)

	}catch(err){
		res.json({ message : err })
	}	
})


module.exports = router
