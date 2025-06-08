const express = require("express");
const { cartsCollection } = require('../config/db/mongodb');
const { ObjectId } = require("mongodb");
const cartsRouter = express.Router({ mergeParams: true });

// add to cart product in the server
cartsRouter.post("/", async (req, res) => {
    try {
        const databody = req.body;
        const result = await cartsCollection.insertOne(databody);
        res.send(result);
    } catch (error) {
        console.log({ errorMessage: error.message });
    }
});

// get data from carts
cartsRouter.get("/", async (req, res) => {
    try {
        const email = req.query.email;
        const query = { email: email };
        const results = await cartsCollection.find(query).toArray();
        res.send(results);
    } catch (error) {
        console.log({ errorMessage: error.message });
    }
});

// carts products delete
cartsRouter.delete("/product/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await cartsCollection.deleteOne(query);
        res.send(result);
    } catch (error) {
        console.log({ errorMessage: error.message });
    }
});

module.exports = cartsRouter;