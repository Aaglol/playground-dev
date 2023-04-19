require('dotenv').config();
const express = require('express');
const router = express.Router();
const nodeCache = require( "node-cache" );
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

const userModal = require('../models/user');

const appCache = new nodeCache();
const secret = process.env.JWT_TOKEN;

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
    
    try {
        const user = await userModal(connection).findOne({ where: { username }});
        if (!user) {
            bcrypt.hash(password, 12).then(async (hash) => {
                await userModal(connection).create({
                    username,
                    password: hash,
                    email,
                }).then((user) => {
                    const maxAge = 60 * 60 * 60;
                    const token = jwt.sign(
                        {id: user.id, username },
                        secret,
                        
                        {
                            expiresIn: maxAge,
                        }
                    );
                    appCache.del('playground_users');
                    res.cookie("jwt", token, {
                        httpOnly: true,
                        maxAge: maxAge * 1000,
                    });
                    const returnMsg = JSON.stringify({status: 'success', data: {id: user.id, username, email: user.email}});
                    res.status(200).send(returnMsg);
                });
            });
        }
    }
    catch (error) {
        console.log('Could not register user');
        res.status(400).send('Kunne ikke opprette bruker');
    }
});

router.post('/user/login', async (req, res) => {
    console.log('hey');

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(408).send('Du må fylle ut alle felt');
    }
    
    const connection = req.app.get('connection');

    console.log('ho');

    try {
        const user = await userModal(connection).findOne({ where: {username}}).catch((e) => {
            console.log('Error finding user: ', e);
        });;
        if (user) {
            bcrypt.compare(password, user.password).then((result) => {
                if (result) {
                    const maxAge = 3 * 60 * 60;
                    const token = jwt.sign(
                        {id: user.id, username },
                        secret,
                        {
                            expiresIn: maxAge,
                        }
                    );
              
                    res.cookie("jwt", token, {
                        expires: new Date(Date.now() + 900000),
                    });
                    console.log('cookie set.', res);
                    res.app.set('user_id', user.id);
               
                    const returnMsg = JSON.stringify({status: 'success', data: {id: user.id, username, email: user.email}});
                
                    return res.status(200).send(returnMsg);
                }
            }).catch((e) => {
                console.log('error: ', e);
            });
        } else {
            return res.status(408).send('Ingen bruker funnet');
        }
    }
    catch (error) {
        console.log('Could not login user');
        res.status(400).send('Kunne ikke logge inn bruker2');
    }
});

router.post("/user/logout", (req, res) => {
    res.cookie("jwt", "", { maxAge: "1" })
    res.status(200).send('logout success');
});

router.get('/user/isloggedin', async (req, res) => {
    try {
        let currentUser = {
            id: 0,
            username: '',
            email: '',
        };
        userId = req.app.get('user_id');
        
        if (userId) {
            const connection = req.app.get('connection');
            const user = await userModal(connection)
                .findOne({ where: { id: userId }});
            
            if (user) {
                currentUser = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                };
            }
        }
        return res.status(200).send(JSON.stringify({status: 'success', data: currentUser}));
    } catch (e) {
        return res.status(400);
    }
});

module.exports = router;
