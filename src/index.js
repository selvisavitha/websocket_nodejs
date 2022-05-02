const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

const app = express()
app.use(express.static(publicDirectoryPath))
const server = http.createServer(app)
const io = socketio(server)

console.log(publicDirectoryPath)

// let count = 0
io.on('connection', (socket) => {
    console.log('New websocket connection')
    socket.on('join', ({ username, room }, callback) => {
        const user = addUser(socket.id, username, room)
        if (user.error) {
            return callback(user)
        }
        console.log('test')
        socket.join(user.room)
        socket.emit('messageFromServer', generateMessage('Admin', 'Welcome to our chat room!'))
        socket.broadcast.to(user.room).emit('messageFromServer', generateMessage('Admin', `${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        if (user) {
            io.to(user.room).emit('messageFromServer', generateMessage(user.username, message))
            callback('Delivered')
        }
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('messageFromServer', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })

    socket.on('sendLocation', (locationData, callback) => {
        console.log(`Location: ${locationData.latitude}, ${locationData.longitude}`)
        const user = getUser(socket.id)
        if(user) {
            io.to(user.room).emit('locationMessage', generateLocationMessage(user.username,`https://google.com/maps?q=${locationData.latitude},${locationData.longitude}`))
            callback('Location Shared!')
        }
    })
})

server.listen(port, () => {
    console.log(`app listening at port ${port}`)
})

