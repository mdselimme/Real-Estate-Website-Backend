
import express from "express";
export const cartsRouter = express.Router();



// add to cart product in the server
cartsRouter.post("/", async (req, res) => {
    const databody = req.body;
    const result = await cartsCollection.insertOne(databody);
    res.send(result);
});

// get data from carts
cartsRouter.get("/", async (req, res) => {
    const email = req.query.email;
    const query = { email: email };
    const results = await cartsCollection.find(query).toArray();
    res.send(results);
});

// carts products delete
cartsRouter.delete("/product/:id", async (req, res) => {
    console.log(req.params.id);
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await cartsCollection.deleteOne(query);
    res.send(result);
});