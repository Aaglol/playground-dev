const Sequelize = require("sequelize");
var dbConfing = require('../config/config');

const dbConnect = () => {
    
    let attempts = 0;

    const connection =  new Sequelize(
        dbConfing.development.database,
        dbConfing.development.username,
        dbConfing.development.password,
        {
            host: dbConfing.development.host,
            dialect: dbConfing.development.dialect,
        },
    );
    
    function connect() {

        connection.authenticate().then(() => {
            console.log('Connection has been established successfully.');
        }).catch((error) => {
            attempts++;

            if (attempts < 3) {
                setTimeout(() => {
                    console.error('attempt.. ', attempts);
                    return connect();
                }, 500);
            }
            console.error('Unable to connect to the database: ', error);
        });

        return connection;
    }

    return connect();
    
}

module.exports = dbConnect;