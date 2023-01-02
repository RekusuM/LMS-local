const bcrypt = require('bcrypt')

const encrypt = async (password)=>{
	return new Promise((resolve,reject)=>{
		bcrypt.hash(password, 10, function(err, hash) {	
			resolve(hash)
		});
	})
}

module.exports = encrypt
