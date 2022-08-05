// essential requires
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");


// auth stuff
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const FileStore = require("session-file-store")(session);
const { auth } = require("./cookie");

// get port for http server
const port = process.env.PORT || "3000";


// connect to database
const mongodbPassword = process.env.MONGODB_PASSWORD || "1LoveMong0";
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
app.use(cookieParser("cookie_secret"));

app.use(express.static(__dirname + "/public"));
app.use((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("X-Step-One", "true");
    res.setHeader("Content-Type", "text/html");

    // cors
    res.setHeader("Access-Control-Allow-Origin", "https://csperando.github.io");
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS,GET,POST");

    next();
});

// adds user obj to req if cookie data exists
app.use(auth);

// // session
// app.use(session({
//     name: "Session-id",
//     secret: "ChangeMe",
//     saveUninitialized: false,
//     resave: false,
//     store: new FileStore()
// }));
//
// app.use(passport.authenticate("session"));


// routes
const mauRouter = require("./routes/mauRouter");
app.use("/mau", mauRouter);

const userRouter = require("./routes/userRouter");
app.use("/auth", userRouter);

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
