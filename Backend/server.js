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
})
.then((con) => {
  console.log("DB connected Successfully");
});

const port = process.env.PORT ;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});

