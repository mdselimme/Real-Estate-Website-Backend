
import express from "express";
import { homes } from "../config/db/mongodb.mjs";
import { ObjectId } from "mongodb";
export const homesRouter = express.Router();


// find homes all Data
homesRouter.get("/", async (req, res) => {
    try {
        const homesdata = await homes.find();
        const result = await homesdata.toArray();
        res.send(result);
    } catch (error) {
        console.log({ errorMessage: error.message });
    }
});

// find home data by id
homesRouter.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await homes.findOne(filter);
        res.send(result);
    } catch (error) {
        console.log({ errorMessage: error.message });
    }
});