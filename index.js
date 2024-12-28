const express = require("express");

require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const jwt = require("jsonwebtoken");

const app = express();

const cors = require("cors");

const port = process.env.PORT || 2000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.dopmx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const database = client.db("HomeLengoRealEstate");
    const homes = database.collection("homes");

    app.post("/jwt", async (req, res) => {
      const body = req.body;
      console.log(body);
      const token = jwt.sign(body, "secret", { expiresIn: "1h" });
      res.send(token);
    });

    // find homes all Data
    app.get("/homes", async (req, res) => {
      const homesdata = homes.find();
      const result = await homesdata.toArray();
      res.send(result);
    });

    app.get("/homes/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await homes.findOne(filter);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server port is ${port}`);
});
