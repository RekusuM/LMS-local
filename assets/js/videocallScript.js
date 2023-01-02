const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})
const ROOM_ID = "<%= roomId %>"
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
const video = document.getElementById("video")
const audio = document.getElementById("audio")
const chat = document.getElementById("chat")
const toastText = document.getElementById("toast-text")
const raiseHand = document.getElementById("raise-hand")
const user = document.getElementById("username")
let userStream

const stream = navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)
  userStream = stream

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

raiseHand.addEventListener('click',()=>{
	console.log("entroElboton")
	socket.emit('raise-hand', user.value)
})

socket.on('raised-hand', userId => {
  toastText.innerHTML=userId+" ha levantado la mano."
  $(document).ready(function(){
    $('.toast').toast('show');
  });
	console.log(userId)

})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}


video.addEventListener('click', ()=>{
	const videoTrack = userStream.getTracks().find(track => track.kind === 'video')
	if(videoTrack.enabled){
		videoTrack.enabled = false
	}else{
		videoTrack.enabled = true

	}
})

audio.addEventListener('click', ()=>{
	const audioTrack = userStream.getTracks().find(track => track.kind === 'audio')
	if(audioTrack.enabled){
		audioTrack.enabled = false
	}else{
		audioTrack.enabled = true

	}
})
