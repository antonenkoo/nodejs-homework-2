const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const process = require("node:process");
mongoose.set("strictQuery", false);

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

const routerApi = require("./routes/api/routing");
app.use("/api", routerApi);

const PORT = process.env.DB_PORT || 3000;
const dbLink = process.env.DB_HOST;

const connection = mongoose.connect(dbLink);

connection
  .then(() => {
    app.listen(PORT, function () {
      console.log(`Database connection successful on port: ${PORT}`);
    });
  })
  .catch((err) => {
    process.on("exit", function () {
      return console.log(
        `Database connection failed. Error message: ${err.message}`
      );
    });
    process.exit(1);
  });
