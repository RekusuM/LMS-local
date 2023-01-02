const RegisterCount = require('../models/studentRegisterCount')

const generateRegister = async ()=>{
	const registerCountDB = await RegisterCount.findOne()

	const date = new Date()
	const currentYear = date.getFullYear().toString()

	let studentNumber = +registerCountDB.registerCount + 1 
	
	const studentNumberStr = studentNumber.toString()
	const register = currentYear.substring(2) + studentNumberStr.padStart(6,'0')
		

	return new Promise((resolve,reject)=>{
				resolve(register)
	})
}


module.exports = generateRegister 
