import express from "express";
import { users } from "../config/db/mongodb.mjs";
import verifyToken from "../middleware/verifyToken.mjs";
export const usersRouter = express.Router();



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
