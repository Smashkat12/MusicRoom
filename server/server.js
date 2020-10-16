const express = require("express");
const session = require("express-session");
const morgan = require("morgan");
const chalk = require("chalk");
const fileUpload = require("express-fileupload");
const passport = require("passport");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
/* const cookieParser = require("cookie-parser"); */
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const contimeout = require("connect-timeout");
const { v4: uuidv4 } = require("uuid");
const keys = require("./config/keys");

const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");

global.__basedir = __dirname;

console.log(__dirname);

/* ***************************************************END OF IMPORTS ********************************************************** */

//DB Connection
mongoose.connect(keys.MONGODB.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

var cl = console.log; //short hand for cleaner code

mongoose.connection.on("connected", () => {
  cl(chalk.bold.greenBright("The db has connected successfully!"));
});
mongoose.connection.on("error", (err) => {
  cl(
    chalk.bold.yellowBright(
      `An error: ${err} occured when trying to connect to db`
    )
  );
});
mongoose.connection.on("disconnected", () => {
  cl(chalk.bold.redBright("The db has disconnected!"));
});

/* ****************************************************END OF DB CONNECTION **************************************************** */
/* Middleware */

app.use(
  session({
    genid: () => {
      return uuidv4();
    },
    secret: "SecretSource",
    cookie: {
      secure: "auto",
      maxAge: 1000 * 60 * 60 * 24 * 7, // expires in a week
    },
    resave: false,
    saveUninitialized: false,
  })
); //

app.use(
  cors({
    origin: [`http://localhost:8080`],
    credentials: true,
  })
); //
app.use(morgan("dev")); //
app.use(bodyParser.json({ limit: "5mb" })); //
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" })); //
app.use(fileUpload()); //
app.use("/public", express.static(__dirname + "/public"));

/* ****************************************************END OF MIDDLEWARE **************************************************** */

/* Start Services */

//swagger api doc gen

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Music Room API",
      description: "Music Room API Information",
      contact: {
        name: "kmorulan & the rest of the gang usernames",
      },
      servers: ["http://localhost:5000"],
    },
  },
  apis: ["./routes/**.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
cl(chalk.bold.yellowBright(JSON.stringify(swaggerDocs)));

//passport
require("./services/passport-service")(passport); //pass same instance of passport to be used in config.
app.use(passport.initialize()); //
app.use(passport.session()); //
app.use(contimeout("6000s"));

/* ****************************************************END OF SERVICES **************************************************** */

//Routes
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/auth", authRouter.router);
app.use("/api/users", userRouter.router);

/* ****************************************************END OF ROUTES **************************************************** */

/* Server Setup */

const port = process.env.PORT || 5000;

app.listen(port, () => {
  cl(chalk.bold.greenBright(`Server Running at ${port}`));
});

/* ****************************************************END OF SERVER SETUP **************************************************** */
