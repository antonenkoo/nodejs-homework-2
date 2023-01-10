const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

require("dotenv").config();

const app = express();

// parse application/json
app.use(express.json());
// cors
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
  .catch((err) =>
    console.log(`Database connection failed. Error message: ${err.message}`)
  );
