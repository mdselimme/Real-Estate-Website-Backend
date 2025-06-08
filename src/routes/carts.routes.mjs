
import express from "express";
import { cartsCollection } from "../config/db/mongodb.mjs";
export const cartsRouter = express.Router();



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