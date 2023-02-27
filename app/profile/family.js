require('dotenv').config();
const express = require('express');
const router = express.Router();

const familyModal = require('../../models/playgroundfamily');
const familyMembersModal = require('../../models/PlaygroundFamilyMembers');

router.get('/user/list', async (req, res) => {
  
    const connection = req.app.get('connection');
  
    items = await familyModal(connection).findAll();
    if (items) {
        res.send(items);
    }
});

router.post('/family/create', async (req, res) => { 
    
    const { plagroundUserId, familyName, familyDescription } = req.body;
    
    const connection = req.app.get('connection');

    try {
        console.log('crating family');
        await familyModal(connection).create({
            playground_user: plagroundUserId,
            family_name: familyName,
            family_description: familyDescription,
            family_status: 1
        });

        res.status(200).send('funket');
    }
    catch (error) {
        console.log('Could not register family', error);
        res.status(400).send('Kunne ikke opprette familie');
    }
});

router.post('/family/member/create', async (req, res) => { 
    
    const { firstName, lastName, dateOfBirth, familyId } = req.body;
    
    const connection = req.app.get('connection');

    try {
        console.log('crating family member'); 

        findFamily = await familyModal(connection).findByPk(familyId);

        if (findFamily) {
            await familyMembersModal(connection).create({
                firstName,
                lastName,
                dateOfBirth,
                family_permission: 1,
                connected_family: findFamily.id,
            });
            res.status(200).send('funket');
        }
    }
    catch (error) {
        console.log('Could not register family', error);
        res.status(400).send('Kunne ikke opprette familie');
    }
});


module.exports = router;
