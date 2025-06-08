
import express from "express";
export const middlewareRouter = express.Router();




// create jwt token
middlewareRouter.post("/jwttoken", async (req, res) => {
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
