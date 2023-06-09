const fs = require("fs");
const path = require("path");

const Cart = require("./cart");

const rootDir = require("../util/path");

const p = path.join(rootDir, "data", "products.json");

const getProductsFromFile = (callbk) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      callbk([]);
    } else {
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
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updatedProducts = [...products];

        updatedProducts[existingProductIndex] = this;

        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
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
