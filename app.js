const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Connect database
connectDB();


const userRoute = require("./routes/user");

// Used to have to install Body Parser as sep package and require it in then initialize it (`app.use(bodyParser.json())`), but now included with Express (since v. 4.16.0, released Oct. 2017). express.json() is based on body-parser and parses incoming requests with JSON payloads (the payload is the part of transmitted data that is the actual intended message. Headers and metadata are sent only to enable payload delivery). Parsing meaning converting from a JSON string representation (when sending data to a web server, the data has to be a string, and in this case the string would follow the JSON specification https://www.quora.com/What-does-parsing-JSON-mean), recognizing the incoming request object as a JSON object
// This binds the express.json() middleware to an instance of the app object. Allows getting data from req.body of POST request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use(
    cors({
        origin: "*",
        methods: "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS",
        preflightContinue: false,
        optionsSuccessStatus: 204
    })
);

app.all("/*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.use(function(err, req, res, next) {
    res.status(500).send("Something wrong broke!");
    console.log(err);
});


app.get("/", (req, res) => {
    return res.status(200).json({ msg: "Welcome to the User MGT PORTAL." });
});

// Define routes
app.use('/api/v1/users', userRoute);



const port = process.env.PORT || 2020;
const server = app.listen(port, () => console.log(`app Running on port ${port}`));

process.on("exit", () => server.close());
process.on("SIGTERM", () => server.close());
process.on("uncaughtException", () => server.close());

module.exports = app;