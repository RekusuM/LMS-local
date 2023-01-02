const schedule = require('node-schedule')
const axios = require('axios')

const setDates = (startFirstPartial,startSecondPartial, startThirdPartial, EndSemester)=>{

	schedule.scheduleJob(startSecondPartial,()=>{
	
		function getGrades() {
		  return axios.get("https://localhost:3000/api/grade/firstPartial");
		}
	
		Promise.all([getGrades()])
		  .then(function (results) {

			function getFinal() {
			  return axios.get("https://localhost:3000/api/grade/firstPartialFinal");
			}

			Promise.all([getFinal()])
			  .then(function (results) {	
				
	
			});

		});
	})


	schedule.scheduleJob(startSecondPartial,()=>{
		function getGrades() {
		  return axios.get("https://localhost:3000/api/grade/secondPartial");
		}
	
		Promise.all([getGrades()])
		  .then(function (results) {

			function getFinal() {
			  return axios.get("https://localhost:3000/api/grade/secondPartialFinal");
			}

			Promise.all([getFinal()])
			  .then(function (results) {	
				
	
			});

		});	
	})

	schedule.scheduleJob(startThirdPartial,()=>{
		function getGrades() {
		  return axios.get("https://localhost:3000/api/grade/thirdPartial");
		}
	
		Promise.all([getGrades()])
		  .then(function (results) {

			function getFinal() {
			  return axios.get("https://localhost:3000/api/grade/thirdPartialFinal");
			}

			Promise.all([getFinal()])
			  .then(function (results) {	
				
	
			});

		});	
	})

	schedule.scheduleJob(EndSemester,()=>{
		function endSemester() {
		  return axios.get("https://localhost:3000/api/grade/endSemester");
		}
	
		Promise.all([endSemester()])
		  .then(function (results) {

		});		
	})
}

module.exports = setDates
