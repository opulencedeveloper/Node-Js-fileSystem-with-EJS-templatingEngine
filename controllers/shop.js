const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getIndex = (req, res, next) => {
  //the fn passed to fetchAll is a callback, since we access the file system
  //which is async, we need a callback fn that runs when the file is done
  Product.fetchAll((products) => {
    //in app.js since we have already set a path to the folder(view) where the templating engine files is stored
    // we just complete the pathname to the templating engine here in the first argument below,
    //the second argument is the data we are passing to this view
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });

  //don't call next after you've sent a response becus this will cause an error
  //as sending a response means closing the process
};

exports.getProducts = (req, res, next) => {
  //the fn passed to fetchAll is a callback, since we access the file system
  //which is async, we need a callback fn that runs when the file is done
  Product.fetchAll((products) => {
    //in app.js since we have already set a path to the folder(view) where the templating engine files is stored
    // we just complete the pathname to the templating engine here in the first argument below,
    //the second argument is the data we are passing to this view
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });

  //don't call next after you've sent a response becus this will cause an error
  //as sending a response means closing the process
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId, (productData) => {
    //in app.js since we have already set a path to the folder(view) where the templating engine files is stored
    // we just complete the pathname to the templating engine here in the first argument below,
    //the second argument is the data we are passing to this view
    res.render("shop/product-detail", {
      product: productData,
      pageTitle: productData.title,
      //'path 'is just an identify which can be any string, which we use to select the active
      //nav bar in the view, which is in the navigation.ejs
      path: "/products",
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        console.log("cccccccccccc", cart.products);
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    //******CAUTION ********
    //Hey, don't remove this comment...
    //you can define a callback in the deleteProduct fn above,
    //so that you only redirect, if the product was successfully deleted.
    //but this was included when I added a real data-base. 
    //if you don't yet understand how to use a call-back.
    //See Product.findById method, I'm busy with work, contact me
    //if you have a stubborn bug
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  //in app.js since we have already set a path to the folder(view) where the templating engine files is stored
  // we just complete the pathname to the templating engine here in the first argument below,
  //the second argument is the data we are passing to this view
  res.render("shop/orders", { path: "/orders", pageTitle: "Your Orders" });
};

exports.getCheckout = (req, res, next) => {
  //in app.js since we have already set a path to the folder(view) where the templating engine files is stored
  // we just complete the pathname to the templating engine here in the first argument below,
  //the second argument is the data we are passing to this view
  res.render("shop/checkout", { path: "/checkout", pageTitle: "Checkout" });
};
