const express = require('express');
const router = express.Router();
var nodeCache = require( "node-cache" );

var helper = require('../services/helper');

let appCache = new nodeCache();

router.get('/list', (req, res) => {
    let items = appCache.get('playground_users');
    if (!items) {
        const connection = req.app.get('connection');

        connection.query('SELECT username from playground_users', function (error, results, fields) {
            if (error) {
                console.warn('error', error);
                return [];
            }
            items = helper.emptyOrRows(results);
            appCache.set('playground_users', JSON.stringify(items), 1000);
            res.send(items);
        });
    } else {
        items = JSON.parse(items);
        res.send(items);
    }
});

router.post('/create', (req, res) => { 
    
    const { username, password, email } = req.body;
    
    if (!username || !password || !email) {
        return res.status(408).send('Du må fylle ut alle felt');
    }
    
    const connection = req.app.get('connection');
    
    connection.query('INSERT INTO playground_users SET username = ?, password = ?, email = ?, family_id = 1', [username, password, email]);

    res.send('bruker opprettet');
});

module.exports = router;
