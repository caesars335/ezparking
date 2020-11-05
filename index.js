const express = require("express");
const path = require("path");
const body_parser = require("body-parser");
// const mysql = require("mysql");
// const config = require("dbConfig.js");

const app = express();
// const con = mysql.createConnection(config);

app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());
app.use(express.static(__dirname + '/public'));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./views/index.html"))
});

app.get("/signUp", function (req, res){
    res.sendFile(path.join(__dirname, "./views/signUp.html"))
});

// <======Starting server======>
const PORT = 9099
app.listen(PORT, function () {
    console.log("Server port is " + PORT);
});