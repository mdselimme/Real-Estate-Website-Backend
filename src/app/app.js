const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");;
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
app.options("*", cors());
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: ["http://localhost:5173", "https://home-lengo-residence.web.app"],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // List allowed methods
        credentials: true, // Allow cookies and credentials
    })
);

// Import All Routers 
const usersRoute = require('../routes/user.routes');
const homeRoute = require('../routes/home.routes');
const cartRoute = require('../routes/carts.routes');
const adminRoute = require('../routes/admin.routes');
const jwt = require('jsonwebtoken');
// const middlewareRoute = require('../middleware/middleware');

// // ALL ROUTER  USE
app.use('/users', usersRoute);
app.use('/homes', homeRoute);
app.use('/carts', cartRoute);
app.use('/admin', adminRoute);


// OPEN ROUTES 
app.get("/", (req, res) => {
    res.send("Server is running");
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


module.exports = app;