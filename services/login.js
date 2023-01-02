const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

require('dotenv').config({ path: 'config/.env' })

login = async (password,hash, user)=>{
	return new Promise((resolve,reject)=>{

		bcrypt.compare(password, hash, function(err, result) {
		
			if(result==true){
				jwt.sign({uid:user._id}, process.env.JWT_KEY, function(err, token) {
					if(err) {
						console.error(err) 
						reject(err)
					}
					resolve(token)
				})
			}else {
				console.log("wrong password")	
				resolve(false)
			}

		})
	})
}

module.exports = login
