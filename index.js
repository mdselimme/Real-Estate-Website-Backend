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
    origin: ["http://localhost:5173", "https://home-lengo-residence.web.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // List allowed methods
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
    const cartsCollection = database.collection("carts");

    // add to cart product in the server
    app.post("/carts", async (req, res) => {
      const databody = req.body;
      const result = await cartsCollection.insertOne(databody);
      res.send(result);
    });

    // get data from carts
    app.get("/carts", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const results = await cartsCollection.find(query).toArray();
      res.send(results);
    });

    // carts products delete
    app.delete("/carts/product/:id", async (req, res) => {
      console.log(req.params.id);
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartsCollection.deleteOne(query);
      res.send(result);
    });

    // create jwt token
    app.post("/jwttoken", async (req, res) => {
      const body = req.query;
      console.log(body);
      const token = jwt.sign(body, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
      });
      res.send({ token });
    });

    // send users data to database
    app.post("/users", async (req, res) => {
      const usersData = req.body;
      const result = await users.insertOne(usersData);
      res.send(result);
    });

    // verify Json Web Token

    const verifyToken = (req, res, next) => {
      if (!req.headers.authorization) {
        return res.status(401).send({ message: "Access Forbidden" });
      }
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        if (error) {
          return res.status(401).send({ message: "Access Forbidden" });
        }
        req.decoded = decoded;
        next();
      });
    };

    // get users data from database
    app.get("/users", verifyToken, async (req, res) => {
      const result = await users.find().toArray();
      res.send(result);
    });

    // update last log in time
    app.patch("/users", async (req, res) => {
      const body = req.body;
      const filter = { email: body.email };
      const updateDoc = {
        $set: {
          lastLoggedInTime: body.lastLoggedInTime,
        },
      };
      const result = await users.updateOne(filter, updateDoc);
      res.send(result);
    });

    // make admin user code
    app.patch("/make/admin", verifyToken, async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const query = { email: email };
      const updateDoc = {
        $set: {
          admin: true,
        },
      };
      const result = await users.updateOne(query, updateDoc);
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
