//SINCE THIS IS A CLASS, MAKE SURE TO ALWAYS USE ARROY FUNCTION, SO THE 'this' KEYWORD
//DOES NOT LOOSE IT'S CONTEXT AND ALWAYS REFERS TO THIS CLASS

const fs = require("fs");
const path = require("path");

const Cart = require("./cart");

const rootDir = require("../util/path");

const p = path.join(rootDir, "data", "products.json");

const getProductsFromFile = (callbk) => {
  //the second argument passed to readFile is a fn that runs ones the file reading is complete.
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      //callback was used because this arrow fn is async, so call back is called when the fn is done
      callbk([]);
    } else {
      //JSON.parse takes a json file and gives us an obj or an array depending on what is in the JSON file
      callbk(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      //if fn triggers when we pass an id to the  constructor, which only happens when we editing
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updatedProducts = [...products];

        //'this' is the current Object value instance passed to this Class,
        //which we created before we called 'save()', check where 'save()' was called in another file(controller/admin file).
        //we created an object instance based on this called b4 we called it
        updatedProducts[existingProductIndex] = this;

        //JSON.stringify takes an obj or an array and converts it to JSON
        //the third argument passed to writeFile is a fn that runs ones the file throws an error.
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();

        //this refers to the data in the contructors which is called by instantiation this Class Object
        products.push(this);

        //JSON.stringify takes an obj or an array and converts it to JSON
        //the third argument passed to writeFile is a fn that runs ones the file throws an error.
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

  static deleteById(id) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.id === id);
      const updatedProduct = products.filter((prod) => prod.id !== id);

      //JSON.stringify takes an obj or an array and converts it to JSON
      //the second argument passed to writw file is the data to be stored in the file
      //the third argument passed to writeFile is a fn that runs ones the file throws an error.
      fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }

  static fetchAll(callbk) {
    getProductsFromFile(callbk);
  }

  static findById(id, callbk) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      callbk(product);
    });
  }
};
