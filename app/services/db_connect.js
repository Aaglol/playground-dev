var mysql = require('mysql2');
var dbConfing = require('./db_config');

const dbConnect = () => {
    let connection = mysql.createConnection(dbConfing);

    connection.connect(function(err) {
        if (err) {
            console.warn('err', err);
        }

        console.log("Connected!");
    });

    return connection
}

module.exports = dbConnect;