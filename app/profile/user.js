require('dotenv').config();
const express = require('express');
const router = express.Router();
const nodeCache = require( "node-cache" );
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userModal = require('../models/user');
const sessionModal = require('../models/session')

const appCache = new nodeCache();
const randomUuid = crypto.randomUUID();
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
                }).then(async (user) => {
                    const maxAge = 60 * 60 * 60;
                    const expiresAtDate = new Date(new Date().getTime() + maxAge * 99000);
                    const token = jwt.sign(
                        {id: user.id, username },
                        secret,
                        
                        {
                            expiresIn: maxAge,
                        }
                    );

                    await sessionModal(connection).create({
                        user_id: user.id,
                        user_session: randomUuid,
                        user_session_expires_at: expiresAtDate,
                    });

                    appCache.del('playground_users');
                    
                    res.cookie("jwt", token, {
                        expires: expiresAtDate,
                        domain: 'www.robin-dev.no',
                        sameSite: 'none'
                    });

                    res.cookie('playground_session', randomUuid, {
                        expires: expiresAtDate,
                        sameSite: 'none',
                        secure: true,
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

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(408).send('Du må fylle ut alle felt');
    }
    
    const connection = req.app.get('connection');

    try {
        const user = await userModal(connection).findOne({ where: {username}}).catch((e) => {
            console.log('Error finding user: ', e);
        });

        if (user) {
            bcrypt.compare(password, user.password).then(async (result) => {
                if (result) {
                    const maxAge = 3 * 60 * 60;
                    const token = jwt.sign(
                        {id: user.id, username },
                        secret,
                        {
                            expiresIn: maxAge,
                        }
                    );
                    
                    const expiresAtDate = new Date(new Date().getTime() + maxAge * 99000);

                    await sessionModal(connection).create({
                        user_id: user.id,
                        user_session: secret,
                        user_session_expires_at: expiresAtDate,
                    });

                    res.cookie("jwt", token, {
                        expires: expiresAtDate,
                        sameSite: 'none',
                        secure: true,
                    });

                    res.cookie("playground_session", randomUuid, {
                        expires: expiresAtDate,
                        sameSite: 'none',
                        secure: true,
                    });
               
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

router.post("/user/logout", async (req, res) => {

    const connection = req.app.get('connection');

    res.cookie("jwt", "", { maxAge: "1" });
    res.cookie("playground_session", { maxAge: "1" });

    console.log('req: ', req);

    await sessionModal(connection).destroy({ where: { user_id: req.params.id }});

    res.status(200).send({ message: 'logout success' });
});

router.get('/user/isloggedin', async (req, res) => {
    try {
        let currentUser = {
            id: 0,
            username: '',
            email: '',
        };
        console.log('yallow! ');
        const sessionCookies = req.cookies;

        console.log('sess: ', sessionCookies);
        
        if (sessionCookies?.playground_session) {
            console.log('hello! ');
            const connection = req.app.get('connection');
            const sessionRow = await sessionModal(connection)
                .findOne({ where: { user_session: sessionCookies.user_session }});

            console.log('sup! ', sessionRow);
            const user = await userModal(connection)
                .findOne({ where: { id: sessionRow.id }});
            console.log('whatsupp! ', user);

            if (user) {
                currentUser = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                };
            }
        } else {
            return res.status(400);
        }
        
        return res.status(200).send(JSON.stringify({status: 'success', data: currentUser}));
    } catch (e) {
        return res.status(400);
    }
});

module.exports = router;
