var express = require('express');
var mongoose = require("mongoose");

var path = require("path");

var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var flash = require("connect-flash");
var passport = require("passport");
var setUpPassport = require("./setuppassport");

var User = require("./models/user");

var Blog = require("./models/blog");

var routes = require("./routes");

var app = express();

app.use(express.static(path.join(__dirname,"public")));

mongoose.connect("mongodb://localhost:27017/demo1");

setUpPassport();

app.set("port", process.env.PORT || 3000);

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());

app.use(session({
   secret: "apple",
   resave: true,
   saveUninitialized: true
}));

app.use(flash());

app.use(passport.initialize());

app.use(passport.session());

app.use(routes);

app.use(function(req,res) {
   res.send("404 not found");
});

app.listen(app.get("port"),function(){
   console.log("Server started on port "+app.get("port"));
});
