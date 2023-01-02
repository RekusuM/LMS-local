const jwt = require('jsonwebtoken')
const verifyToken = require('../services/verifyToken')
const UserStudent = require('../models/userStudent')


require('dotenv').config({ path: 'config/.env' })


const checkAuth = (roles) => async (req, res, next) => {
	try{
		if(req.cookies.jwt==null){
			res.status(403)
			res.redirect('/login')
		}else{
			const token = req.cookies.jwt
			const tokenData = await verifyToken(token)
			const userData =  await UserStudent.findById(tokenData.uid)

			if([].concat(roles).includes(userData.role)){
				next()
			}else{
				res.status(403)
				res.send({ error : 'Acceso denegado'})
			}
		}

	}catch(e){
		console.log(e)
	}
}

module.exports = checkAuth
