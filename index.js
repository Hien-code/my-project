// Initialize and configure Express
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
const moment = require("moment");

require("dotenv").config(); // Load environment variables early

const app = express();

// TinyMCE static assets
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

// Flash messages
app.use(cookieParser("CONGHIENCODE"));
app.use(
  session({
    secret: "CONGHIENCODE", // nên đặt trong .env (SESSION_SECRET)
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);
app.use(flash());

// Middleware
app.use(methodOverride("_method"));

// Body parser (Express built-in)
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Nếu bạn có xử lý JSON API thì giữ dòng này

// Static files
app.use(express.static(path.join(__dirname, "public")));

// View engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Connect to database
const database = require("./config/database");
database.connect();

// Load routes
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
route(app);
routeAdmin(app);

// Local variables for views
const systemConfig = require("./config/system");
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
