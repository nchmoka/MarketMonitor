require("dotenv").config(); // load .env variables

const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const contactUsRoutes = require("./routes/contactUs");
const stocksRoutes = require("./routes/stocks");

// express app
const app = express();

// middleware

app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

app.get("/", (req, res) => {
    res.send("Server is running");
  });
  

// routes
app.use("/api/user", userRoutes);

app.use('/api/contactUs', contactUsRoutes);

// TODO: add route for stocks api, it should return a list of stocks from outer api
app.use("/api/stocks", stocksRoutes);

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
