const {Server}= require("socket.io");

let io;

const initSocket = (server) =>{
    io = new Server(server,{
        cors:{
            origin:"*"
        }
    });

    io.on("connection",(socket)=>{
        console.log("user connected", socket.id);

        socket.on("joinMatch",(matchId) =>{
            socket.join(matchId);
            console.log(`User ${socket.id} joined match ${matchId}`);
        });
    });

    return io;
}

const getIo = ()=>{
    if(!io){
        throw new Error("Socket.io is not initialize");
    }

    return io;
}

module.exports = {initSocket, getIo};