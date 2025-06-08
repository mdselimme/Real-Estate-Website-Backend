
import express from "express";
import verifyToken from "../middleware/verifyToken.mjs";
import { users } from "../config/db/mongodb.mjs";
export const adminsRouter = express.Router();


// make admin user code
adminsRouter.patch("/make-admin", verifyToken, async (req, res) => {
    try {
        const email = req.query.email;
        const status = req.query.status;
        console.log(email);
        const query = { email: email };
        const updateDoc = {
            $set: {
                admin: status,
            },
        };
        const result = await users.updateOne(query, updateDoc);
        res.send(result);
    } catch (error) {
        console.log({ errorMessage: error.message });
    }
});

// get admin
adminsRouter.get("/find/:email", verifyToken, async (req, res) => {
    try {
        const email = req.params.email;
        if (email !== req.decoded.email) {
            return res.status(401).send({ message: "Access Unauthorized" });
        }
        const query = { email: email };
        const result = await users.findOne(query);
        let admin = "false";
        if (result) {
            admin = result?.masterAdmin === "true";
        }
        res.send({ masterAdmin: admin });
    } catch (error) {
        console.log({ errorMessage: error.message });
    }
});