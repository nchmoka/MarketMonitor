require("dotenv").config(); // load .env variables

const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");

// express app
const app = express();

// middleware
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// routes
app.use("/api/user", userRoutes);

// TODO: add route for stocks api, it should return a list of stocks from outer api
// app.use("/api/stocks", stockRoutes);

// connect to mongodb & listen for requests
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log("Connected to MongoDB");
            console.log("listening on port "+process.env.PORT);
        });
    })
    .catch((error) => {
        console.log(error);
    });
