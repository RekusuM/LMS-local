const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const https = require('https')
const fs = require('fs')
const {spawn}=require('child_process')
const schedule = require('node-schedule')
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0

require('dotenv').config({ path: 'config/.env' })

const app = express()

const options = {	
	cert:fs.readFileSync('cert.pem'),
	key:fs.readFileSync('key.pem')
}
const URI = "mongodb+srv://admin:123@clusterlms.svl6biy.mongodb.net/test"
const ARCHIVE_PATH = path.join(__dirname,'backups',`backup.gzip`)

const backup=schedule.scheduleJob('0 0 * * *',function(){
  backupDB()
})


function backupDB(){
  const child = spawn('mongodump',[
    `--uri=${URI}`,
    `--archive=${ARCHIVE_PATH}`,
    '--gzip'
  ])

  child.stdout.on('data',(data)=>{
    console.log('stdout:\n', data)
  })
  child.stderr.on('data',(data)=>{
    console.log('stderr:\n', data)
  })
  child.on('error',(data)=>{
    console.log('error:\n', data)
  })
  child.on('exit',(code,signal)=>{
    if(code) console.log('process exit with code:', code)
    else if(signal)console.log('process killed with signal:', signal)
    else console.log('backup successfull')
  })
}
const server = require('https').createServer(options, app)
const io = require('socket.io')(server)


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

mongoose.connect(
	process.env.DB_CONNECTION,
	{ useNewUrlParser: true, useUnifiedTopology: true},
	() => console.log('DB connected')
)

app.set('view engine', 'ejs')

//load assets
app.use('/css',express.static(path.resolve(__dirname,'assets/css')))
app.use('/js',express.static(path.resolve(__dirname,'assets/js')))
app.use('/img',express.static(path.resolve(__dirname,'assets/img')))


//Videocall


io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {

    socket.join(roomId)
    socket.to(roomId).emit('user-connected', userId)

    socket.on('raise-hand',(username)=>{
	    console.log(username)
	    socket.to(roomId).emit('raised-hand',username)
    })

    socket.on('disconnect', () => {
    	socket.to(roomId).emit('user-disconnected', userId)
    })
	  
  })
})


//routes
const routes = require('./api-routes/postulate-routes')

app.use('/api/postulate', routes)

const routesR = require('./api-routes/postulateRevision-routes')

app.use('/api/postulateRevision', routesR)

const routesL = require('./api-routes/login')

app.use('/api/login', routesL)

const routesGroupAssignation = require('./api-routes/studentGroupAssignation')

app.use('/api/groups', routesGroupAssignation)

const routesTimeAssignment = require('./api-routes/timeAssignment')

app.use('/api/timeAssignment', routesTimeAssignment)

const subjects = require('./api-routes/subjects')

app.use('/api/subjects', subjects)

const classrooms = require('./api-routes/classroom')

app.use('/api/classrooms', classrooms)

const publication = require('./api-routes/publication')

app.use('/api/publication', publication)

const assignments = require('./api-routes/assignments')

app.use('/api/assignment', assignments)


const frontend = require('./frontend-routes/frontend-routes')

app.use('/', frontend)

const teachers = require('./api-routes/teachers')

app.use('/api/teachers', teachers)

const admin = require('./api-routes/admin')

app.use('/api/admin', admin)

const adminC = require('./api-routes/adminC')

app.use('/api/adminC', adminC)

const assignSchedule = require('./api-routes/assignSchedule')

app.use('/api/assignSchedule', assignSchedule)

const registerCount = require('./api-routes/addRegister')

app.use('/api/registerCount', registerCount)


const dropped = require('./api-routes/dropped')

app.use('/api/drop', dropped)


const ponderation = require('./api-routes/classroomPonderation')

app.use('/api/ponderation', ponderation)


const template = require('./api-routes/template')

app.use('/api/template', template)

const grade = require('./api-routes/grade')

app.use('/api/grade', grade)

const promote = require('./api-routes/promote')

app.use('/api/promote', promote)

const assistance = require('./api-routes/assistence')

app.use('/api/assistance', assistance)


server.listen(3000)
