const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const rootDir = require("./util/path");
const errorController = require('./controllers/error');

const app = express();

//Sets our app to use the handlebars view engine, here we named it 'hbs' which will be the extenstion name
app.set("view engine", "ejs");
//this sets the folder where the templating engines will be stored(this is the default folder but I just set it here to make it clear)
//the first argument has to be called views, the second argument is 
//the name of the folder or path to where the templating engine file are kept
app.set('views', 'views');

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

//do this before your route middleware if you want to parse the incoming request body
//there are types of body parser to use, eg the one for files, check other gitHub repo or files.
//The extended option allows to choose between parsing the URL-encoded data with the querystring library (when false) or the qs library (when true).
//extended” allows for rich objects and arrays to be encoded into the URL-encoded format,
app.use(bodyParser.urlencoded({ extended: true }));

//this routes serves static files like CSS
//it allows access to the folder specified here
//it takes any request that is trying to find a file and forwards it to the
//path specified here, you can specify more paths
app.use(express.static(path.join(rootDir, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

//catch all routes middle-ware, incase non of the routes matches, normally used for 404 pages
app.use(errorController.get404);

app.listen(3000);
