require('dotenv').config();
var express = require('express');
var app = express();
var cors = require('cors');

var dbConnect = require('./services/db_connect');
var users = require('./profile/user');

let connection = dbConnect();

if (!app.connection) {
    app.set('connection', connection)
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.all('*', users);

var server = app.listen(8081, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log("Listening in at http://%s:%s", host, port);
});
