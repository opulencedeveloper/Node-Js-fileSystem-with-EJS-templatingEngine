const shopController = require("../controllers/shop");

const express = require("express");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

//if you have a static route like 'products/delete'.
//the order matters since this can be seen as a dynamic route in the dynamic route below.
//so define static route first before its dynamic route

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", shopController.getCart);

router.post("/cart", shopController.postCart);

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.get("/checkout", shopController.getCheckout);

router.get("/orders", shopController.getOrders);

module.exports = router;
