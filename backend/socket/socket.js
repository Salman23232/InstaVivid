import {Server} from 'socket.io'
import http from 'http'
import express from 'express'

export const app = express()

export const server = http.createServer(app)
export const io = new Server(server,{
cors:{
    origin:"http://localhost:5173",
    methods:['GET','POST']
}
})
const userSocket = {}  //this object stores socket id corresponding the user id
export const getReceiverSocketId = (receiverId)=> userSocket[receiverId]
io.on("connection",(socket)=>{

    const userId = socket.handshake.query.userId
    if(userId){
        userSocket[userId] = socket.id
        console.log(`connection established.${userId} no. user is online at socket no. ${socket.id}`);
        
    }
    io.emit('getOnlineUsers',Object.keys(userSocket))
    socket.on('disconnect',()=>{
        if(userId){
            delete userSocket[userId]
        console.log(`Disconnected.${userId} no. user is offline at socket no. ${socket.id}`);
    io.emit('getOnlineUsers',Object.keys(userSocket))

        }
    })

})