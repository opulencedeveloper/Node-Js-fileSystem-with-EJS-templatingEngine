//SINCE THIS IS A CLASS, MAKE SURE TO ALWAYS USE ARROY FUNCTION, SO THE 'this' KEYWORD
//DOES NOT LOOSE IT'S CONTEXT AND ALWAYS REFERS TO THIS CLASS

const fs = require("fs");
const path = require("path");

const rootDir = require("../util/path");

const p = path.join(rootDir, "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    //the second argument passed to readFile is a fn that runs ones the file reading is complete.
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        //JSON.parse takes a json file and gives us an obj or an array depending on what is in the JSON file
        cart = JSON.parse(fileContent);
      }
      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // Add new product/ increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      //the second argument passed to writeFile is what you are writing to the file found in the path
      //passed to the 1st argument of writeFilem the third argument is an anonymous fn  which runs
      //when there is an error.
      //JSON.stringify takes an obj or an array and converts it to JSON
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    //the second argument passed to readFile is a fn that runs ones the file reading is complete.
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(fileContent) };
      const product = updatedCart.products.find((prod) => prod.id === id);
      
      //since we are also deleting the product from the cart,
      //we check of its there or not,
      if (!product) {
        return;
      }
      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );
      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * productQty;

      //the second argument passed to writeFile is what you are writing to the file found in the path
      //passed to the 1st argument of writeFilem the third argument is an anonymous fn  which runs
      //when there is an error.
      //JSON.stringify takes an obj or an array and converts it to JSON
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(cb) {
    //the second argument passed to readFile is a fn that runs ones the file reading is complete.
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
};
