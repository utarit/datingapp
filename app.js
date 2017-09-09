const express           = require("express");
const bodyParser        = require("body-parser");
const mongoose          = require("mongoose");
const methodOverride    = require("method-override");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

mongoose.connect('mongodb://localhost/datingapp');

