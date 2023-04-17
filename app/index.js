require('dotenv').config();
var express = require('express');
var app = express();
var cors = require('cors');
const cookieParser = require('cookie-parser')

var dbConnect = require('./services/db_connect');

app.use(require('express-status-monitor')())

var users = require('./profile/user');
var family = require('./profile/family');
const auth = require('./middleware/auth');
let connection = dbConnect();

if (!app.connection) {
    app.set('connection', connection)
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({origin: {customOrigin: ['https://www.robin-dev.no/', 'http://localhost:3000/']}, credentials: true}));
app.use(cookieParser());


app.use('/user/isloggedin', auth.UserAuth);
app.use('/user/logout', auth.UserAuth);

app.get('/family/list', family);
app.post('/family/create', family);
app.post('/family/member/create', family);
app.all('*', users);

var server = app.listen(3001, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log("Listening in at http://" + host + ':' + port);
});
