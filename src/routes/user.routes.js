const express = require('express');
const usersRouter = express.Router({ mergeParams: true });
const verifyToken = require('../middleware/verifyToken');
const { users } = require('../config/db/mongodb');


// send users data to database
usersRouter.post("/", async (req, res) => {
    try {
        const usersData = req.body;
        const result = await users.insertOne(usersData);
        res.send(result);
    } catch (error) {
        console.log({ errorMessage: error.message });
    }
});


// get users data from database
usersRouter.get("/", verifyToken, async (req, res) => {
    try {
        const result = await users.find().toArray();
        res.send(result);
    } catch (error) {
        console.log({ errorMessage: error.message });
    }
});

// update last log in time
usersRouter.patch("/", async (req, res) => {
    try {
        const body = req.body;
        const filter = { email: body.email };
        const updateDoc = {
            $set: {
                lastLoggedInTime: body.lastLoggedInTime,
            },
        };
        const result = await users.updateOne(filter, updateDoc);
        res.send(result);
    } catch (error) {
        console.log({ errorMessage: error.message });
    }
});



module.exports = usersRouter;