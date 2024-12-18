const { Server } = require('socket.io');

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log("New client connected", socket.id);

        // On client disconnection
        socket.on('disconnect', () => {
            console.log("Client disconnected", socket.id);
        });
    });
};

const getSocketInstance = () => {
    if (!io) {
        throw new Error("Socket not initialized");
    }
    return io;
};

module.exports = { initializeSocket, getSocketInstance };
