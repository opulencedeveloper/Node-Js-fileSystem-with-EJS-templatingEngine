exports.get404 = (req, res, next) => {
    //since we have already defined a path to where to templating engine files is stored
    //at the app.js file, we just name the name of the templating engine here in the first argument below,
    //the second argument is the data we are passing to this view
    res.render("404", { pageTitle: "404", path: null, });
    //don't call next after you've sent a response becus this will cause an error
    //as sending a response means closing the process
  } 