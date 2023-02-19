require('dotenv').config();
var express = require('express');
var app = express();
var cors = require('cors');
var mysql = require('mysql2');
var helper = require('./services/helper');
var dbConfing = require('./services/db_connect');
var users = require('./profile/user');

let connection = mysql.createConnection(dbConfing);

connection.connect(function(err) {
    if (err) {
        console.warn('err', err);
    }

    console.log("Connected!");
});

app.set('connection', connection)
app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

app.get('/list', function (req, res) {
    connection.query('SELECT username from playground_users', function (error, results, fields) {
        if (error) {
            console.warn('error', error);
            return [];
        }
        const data = helper.emptyOrRows(results);
        res.send(data);
    });
});

app.post('/create', users);

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Listening in at http://%s:%s", host, port)
});
