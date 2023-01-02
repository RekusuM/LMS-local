const jwt = require('jsonwebtoken')

require('dotenv').config({ path: 'config/.env' })

const verifyToken = async (token)=>{
	try{
		return jwt.verify(token,process.env.JWT_KEY)

	}catch(e){
		return null
	}
}

module.exports = verifyToken
