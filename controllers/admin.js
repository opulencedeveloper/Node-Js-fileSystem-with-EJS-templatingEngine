const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  //in app.js since we have already set a path to the folder(view) where the templating engine files is stored.
  //we just complete the pathname to the templating engine here in the first argument below,
  //the second argument is the data we are passing to this view
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
  //don't call next after you've sent a response becus this will cause an error
  //as sending a response means closing the process
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.productId;
  Product.findById(prodId, (productData) => {
    if (!productData) {
      return res.redirect("/");
    }
    //in app.js since we have already set a path to the folder(view) where the templating engine files is stored.
    //we just complete the pathname to the templating engine here in the first argument below,
    //the second argument is the data we are passing to this view
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: productData,
    });
  });

  //don't call next after you've sent a response becus this will cause an error
  //as sending a response means closing the process
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedDesc,
    updatedPrice
  );

  updatedProduct.save();
  res.redirect("/admin/products");
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  //the fn passed to fetchAll is a callback, since we access the file system
  //which is async, we need a callback fn that runs when the file is done
  Product.fetchAll((products) => {
    //in app.js since we have already set a path to the folder(view) where the templating engine files is stored
    // we just complete the pathname to the templating engine here in the first argument below,
    //the second argument is the data we are passing to this view
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect('/admin/products');
};
