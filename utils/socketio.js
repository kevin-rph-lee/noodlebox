const socketio = require('socket.io');

let io;
module.exports = {
    init: function(server) {
        io = socketio(server);
        //Numbers of users connected. Initially 0
        let clientsConnected = 0

        io.on('connection', function(socket){
        //Client connecting, incrementing client counter
        clientsConnected++
        console.log('Client connected. Total clients connected ' + clientsConnected)

        // //When a message is recieved from a client, echo it to all other clients connected
        // socket.on("message from client", (arg) => {
        //     console.log('reieved')
        //     console.log(arg)
        //     // socket.broadcast.emit('message to client', arg)
        //     // socket.to(1).emit('message to client', 'enjoy the game')
        //     io.in().emit('message to client', 'enjoy the game')
        // });

        socket.on("join", (userID) => {
            socket.join(userID)
            console.log('Rooms:')
            console.log(socket.rooms)
        });

        socket.on("leave", (userID) => {
            socket.leave(userID)
            console.log('Rooms:')
            console.log(socket.rooms)
        });

        //Deincrement the counter when the client disconnects
        socket.on("disconnect", (reason) => {
            clientsConnected--
            console.log('Client connected. Total clients connected ' + clientsConnected)
        });
        })
       return io;
   },
   getIO: function() {
       if (!io) {
          throw new Error("Can't get io instance before calling .init()");
       }
       return io;
   },
   notifyOrderCompleted: (userID) => {
    console.log('Sending message to room ' + userID)
    socket.to(userID).emit('message to client', 'enjoy the game')
   }
}