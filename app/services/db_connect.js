const Sequelize = require("sequelize");
var dbConfing = require('../../config/config');

const dbConnect = () => {
   
    const connection =  new Sequelize(
        dbConfing.development.database,
        dbConfing.development.username,
        dbConfing.development.password,
        {
            host: dbConfing.development.host,
            dialect: dbConfing.development.dialect,
        },
    );

    connection.authenticate().then(() => {
        console.log('Connection has been established successfully.');
    }).catch((error) => {
        console.error('Unable to connect to the database: ', error);
    });

    return connection
}

module.exports = dbConnect;