const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

//route
const UserRoute = require("./routes/user");
app.use("/api/user", UserRoute);

mongoose
  .connect(process.env.MONGOSE)
  .then(() => console.log("good"))
  .catch((err) => console.log(err));

app.listen(5000, () => console.log("server is running on 5000"));
