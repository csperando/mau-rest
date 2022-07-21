// essential requires
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");


// get port for http server
const port = process.env.PORT || "3000";


// connect to database
const mongodbPassword = process.env.MONGODB_PASSWORD || "";
if(mongodbPassword == "") {
    // error
    throw("OH NO!");

} else {
    var connectionString = "mongodb+srv://sa:" + mongodbPassword + "@cluster0.1lrnz.mongodb.net/MAU?retryWrites=true&w=majority";
    const connect = mongoose.connect(connectionString);
    connect.then((db) => {
        console.log(`Successfully connected to ${db.connection.name}`);

    }).catch((error) => {
        console.error(error);

    });

}


// set up express app
const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use((req, res, next) => {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Access-Control-Allow-Origin", "http://csperando.github.io");
    next();
});


// routes
const mauRouter = require("./routes/mauRouter");
app.use("/mau", mauRouter);


// catch errors
app.use((req, res, next) => {
    if(res.statusCode != 200) {
        // sad face
    }
    console.log(`${res.statusCode} ${req.method} - "${req.path}"`);
    res.end();
});


// start server
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server up on port ${port}`);
});
