const express = require('express');
const router = express.Router();

router.post('/create', (req, res) => { 
    
    console.log('hello2', req.body);
    const { username, password, email } = req.body;
    console.log(username, password, email);
    
    if (!username || !password || !email) {
        return res.status(408).send('Du må fylle ut alle felt');
    }
    
    const connection = req.app.get('connection');
    
    connection.query('INSERT INTO playground_users SET username = ?, password = ?, email = ?, family_id = 1', [username, password, email]);

    res.send('bruker opprettet');
});

module.exports = router;
