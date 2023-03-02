const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const cookieParser = require('cookie-parser')
require('dotenv').config()

app.use(cookieParser())
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));

app.use(
  express.urlencoded({
    extended: true,
  })
);

const dbDriver =
  "mongodb+srv://trisharati:vE9tAJ40v0HkfNxX@cluster0.kkmvasl.mongodb.net/basicadmin";
const jwtAuth = require('./middleware/authJwt')
app.use(jwtAuth.authJwt)
const adminRouter = require("./routes/admin.routes");

app.use("/admin", adminRouter);

const port = process.env.PORT || 2000;

mongoose
  .connect(dbDriver, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    app.listen(port, () => {
      console.log(`Db is connected`);
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
