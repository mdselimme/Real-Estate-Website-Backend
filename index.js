const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

const port = process.env.PORT || 2000;
app.use(
  cors({
    origin: "http://localhost:5173",
    // methods: ["GET", "POST", "PUT", "DELETE"], // List allowed methods
    credentials: true, // Allow cookies and credentials
  })
);
app.use(express.json());
app.use(cookieParser());

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
    const users = database.collection("usersData");

    // create jwt token
    app.post("/email", async (req, res) => {
      const body = req.body;
      console.log(body);
      const token = jwt.sign(body, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
      });
      console.log(token);
      res.send(token);
    });

    // send users data to database
    app.post("/users", async (req, res) => {
      const usersData = req.body;
      const result = await users.insertOne(usersData);
      res.send(result);
    });

    // find homes all Data
    app.get("/homes", async (req, res) => {
      const homesdata = homes.find();
      const result = await homesdata.toArray();
      res.send(result);
    });

    // find home data by id
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
