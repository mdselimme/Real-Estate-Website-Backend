const express = require("express");
const { homes } = require('../config/db/mongodb');
const { ObjectId } = require("mongodb");
const homesRouter = express.Router({ mergeParams: true });


// find homes all Data
homesRouter.get("/", async (req, res) => {
    try {
        const homesdata = homes.find();
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

module.exports = homesRouter;