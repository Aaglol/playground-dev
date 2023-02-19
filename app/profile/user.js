const express = require('express');
const router = express.Router();
var nodeCache = require( "node-cache" );

var userModal = require('../../models/user');

let appCache = new nodeCache();

router.get('/user/list', async (req, res) => {
    let items = appCache.get('playground_users'); 
    const connection = req.app.get('connection');
    
    if (!items) {
        items = await userModal(connection).findAll();
        if (items) {
            appCache.set('playground_users', JSON.stringify(items), 1000);
            res.send(items);
        }
    } else {
        items = JSON.parse(items);
        res.send(items);
    }
});

router.post('/user/create', async (req, res) => { 
    
    const { username, password, email } = req.body;
    
    if (!username || !password || !email) {
        return res.status(408).send('Du må fylle ut alle felt');
    }
    
    const connection = req.app.get('connection');
    
    await userModal(connection).create({
        username,
        password,
        email
    });

    appCache.del('playground_users');
    res.send('bruker opprettet');
});

module.exports = router;
