const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const compression = require("compression");
const serverless = require("serverless-http");

// auth stuff
const cors = require("../cors");
const cookieParser = require("cookie-parser");
const cookie = require("../cookie");

// connect to database
const mongodbPassword = process.env.MONGODB_PASSWORD || "1LoveMong0";
if (mongodbPassword == "") {
	// error
	throw "OH NO!";
} else {
	var connectionString =
		"mongodb+srv://sa:" +
		mongodbPassword +
		"@cluster0.1lrnz.mongodb.net/MAU?retryWrites=true&w=majority";
	const connect = mongoose.connect(connectionString);
	connect
		.then((db) => {
			console.log(`Successfully connected to ${db.connection.name}`);
		})
		.catch((error) => {
			console.error(error);
		});
}

// set up express app
const app = express();
app.use(bodyParser.json());
app.use(cors);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cookie);
app.use(compression({ level: 1 }));

app.use((req, res, next) => {
	res.statusCode = 200;
	res.setHeader("X-Step-One", "true");
	res.setHeader("Content-Type", "application/json");
	res.setHeader("Access-Control-Allow-Headers", "*");
	res.setHeader("Access-Control-Allow-Methods", "OPTIONS,GET,POST");

	next();
});

// routes
const mauRouter = require("../routes/mauRouter");
app.use("/mau", mauRouter);

const userRouter = require("../routes/userRouter");
app.use("/auth", userRouter);

// catch errors
app.use((req, res, next) => {
	if (res.statusCode != 200) {
		// sad face
	}
	console.log(`${res.statusCode} ${req.method} - "${req.path}"`);
	res.end();
});

module.exports.handler = serverless(app);
