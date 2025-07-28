//Initialize and configure Expressv
const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");

const app = express();

//Notifications
app.use(cookieParser("CONGHIENCODE"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

//POST
app.use(methodOverride("_method"));

//Body
app.use(bodyParser.urlencoded());

//Load environment variables
require("dotenv").config();

//Connect to the database
const database = require("./config/database");
database.connect();

//Get the port from environment
const port = process.env.PORT;

//Get the port from environment
const route = require("./routes/client/index.route");

//Get the port admin from environment
const routeAdmin = require("./routes/admin/index.route");

//Configure the view engine
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// Serve static assets
app.use(express.static(`${__dirname}/public`));

//Initialize client routes
route(app);
routeAdmin(app);

//Create Locals Variables
const systemConfig = require("./config/system");
app.locals.prefixAdmin = systemConfig.prefixAdmin;

//Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
