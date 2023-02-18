var express = require('express');
var app = express();
var mysql = require('mysql');
var fs = require("fs");

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    insecureAuth : true
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});


app.get('/listUsers', function (req, res) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
        console.log( data );
        res.end( data );
    });
});


app.post('createUser', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
});