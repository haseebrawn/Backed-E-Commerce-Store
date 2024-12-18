const http = require('http');
const { initializeSocket } = require('./src/utils/socket');
const dotenv = require("dotenv");
const express = require('express');
const mongoose = require('mongoose');

const app = require('./app');
app.use(express.json());
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("DB connected Successfully");
});

const server = http.createServer(app);

// Initialize socket.io
initializeSocket(server);

const port = process.env.PORT;
server.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
