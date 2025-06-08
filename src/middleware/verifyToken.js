const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();


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


module.exports = verifyToken;