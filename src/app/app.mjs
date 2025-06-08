import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { cartsRouter } from "../routes/carts.routes.mjs";
import { homesRouter } from "../routes/homes.router.mjs";
import { usersRouter } from "../routes/user.routes.mjs";
import { adminsRouter } from "../routes/admin.routes.mjs";
import { middlewareRouter } from "../middleware/middleware.mjs";

// ALL ROUTER EXPORT AND USE
app.use('/users', usersRouter);
app.use('/homes', homesRouter);
app.use('/carts', cartsRouter);
app.use('/admin', adminsRouter);
app.use('/middleware', middlewareRouter);


app.use(
    cors({
        origin: ["http://localhost:5173", "https://home-lengo-residence.web.app"],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // List allowed methods
        credentials: true, // Allow cookies and credentials
    })
);
app.use(express.json());
app.use(cookieParser());



app.get("/", (req, res) => {
    res.send("Server is running");
});

export default app;