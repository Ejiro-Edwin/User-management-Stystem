const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();
const { mongoConnect } = require("./config/keys");

const server = express();

server.use(express.json());
server.use(cors());

//connect to mongodb
mongoose
    .connect(mongoConnect, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(err.message);
    });

//to test that server is up and running
server.get("/", (req, res) => {
    res.send("It's alive!");
});

module.exports = server;