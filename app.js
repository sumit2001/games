const express=require("express");
const app=express();
const socket=require("socket.io");
// app.listen(5500,()=>console.log('Listening at 3000'));
app.use(express.static('public'));
app.use('/snake',express.static('public/games files/Snake Game'));
app.use('/dragon',express.static('public/games files/dragon game'));
app.use('/tictactoe',express.static('public/games files/Tic Tac Toe'));
let port=5500;
let server=app.listen(port,()=>{
    console.log("Listening to port "+port);
})

let io=socket(server);

let users = {};
let mapping={};
io.on("connection",(socket)=>{
    
    socket.on("played",(data)=>{
        if(!mapping[socket.id])
            socket.emit('return',"First Make a room and invite your friends.")
        else if(!users[mapping[socket.id].room][1])
            socket.emit('return',"Invite your friends first or play in Single player Mode.")
        else{
            if(mapping[socket.id].token===data.currTurn){
                if(data.currTurn==="X")
                    io.sockets.to(users[mapping[socket.id].room][1].id).emit("played",data);
                else
                    io.sockets.to(users[mapping[socket.id].room][0].id).emit("played",data);
                socket.emit('returnplayed',{status:"OK",className:data.className})
            }else{
                socket.emit('returnplayed',{status:"error"})
            }
        }
    })
    
    socket.on("make room",(roomname)=>{
        if(users[roomname]){
            socket.emit('return',"Room Name already Exists. Please try different one !");
        }else{
            socket.emit('returnMakeRoom',roomname);
            users[roomname]=[];
        }  
    });

    socket.on("join room",(data)=>{
        const user={
            name:data.userName,
            id:socket.id,
            token:data.token
        }
        if(users[data.roomName]){
            if(users[data.roomName].length==1&&users[data.roomName][0].id===socket.id){
                socket.emit('return',"You are already in this room.")
            }
            else if(users[data.roomName].length<2){
                mapping[socket.id]={room:data.roomName,token:data.token};
                users[data.roomName].push(user);
                socket.emit('returnJoin',data.roomName);
                socket.emit('returnJoinAllFriends',{roomName:data.roomName,users:users[data.roomName]});
                if(users[data.roomName].length==2)
                   socket.to(users[data.roomName][0].id).emit('returnJoinAllFriends',{roomName:data.roomName,users:users[data.roomName]});
            }else{
                socket.emit('return',"Room is full. Please join another room.");
            }
            
        }
        else{
            socket.emit('return',"Invalid Room Name")
        }
        console.log(users);
    })
    
    socket.on("disconnect",()=>{
        Object.keys(users).forEach(function(key) {
            if(users[key][0].id===socket.id){
                if(users[key].length==2){
                    io.sockets.to(users[key][1].id).emit('returnHostDiss',"Sorry, Host has been disconnected");
                }
                delete users[mapping[socket.id].room];
            }else if(users[key].length==2&&users[key][1].id===socket.id){
                users[mapping[socket.id].room].splice(1,1);
                console.log(users[mapping[socket.id].room]);
                socket.to(users[key][0].id).emit("returnJoinAllFriends",{roomName:mapping[socket.id].room,users:users[mapping[socket.id].room]});
            }
        });
        delete mapping[socket.id];
    })

    socket.on("reset",()=>{
        if(mapping[socket.id].token=="X"){
            io.sockets.to(users[mapping[socket.id].room][1].id).emit("resetData");
        }else{
            io.sockets.to(users[mapping[socket.id].room][0].id).emit("resetData");
        }
    })

    
});
