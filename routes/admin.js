const path = require("path");

const express = require("express");

const adminController = require('../controllers/admin');

const router = express.Router();


router.get("/add-product", adminController.getAddProduct);

router.get("/products", adminController.getProducts);

router.post("/add-product", adminController.postAddProduct);

//if you have a static route like 'products/delete'.
//the order matters since this can be seen as a dynamic route in the dynamic route below.
//so define static route first before its dynamic route

router.get("/edit-product/:productId", adminController.getEditProduct);

router.post("/edit-product", adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;
