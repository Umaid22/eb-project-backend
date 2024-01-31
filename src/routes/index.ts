import express from "express";

import { authController } from "../controller/authController";
import { blogController } from "../controller/blogController";
import { commentController } from "../controller/commentController";
import { productController } from "../controller/productController";

import { authHandler } from "../middlewares/authHandler";
import { searchProductController } from "../controller/searchProductController";

const router = express.Router();

// * TESTING
router.get("/", (req, res) =>
	res.json({ message: "This end point is for test and its working.." })
);

// * USER
// register
router.post("/register", authController.register);
// login
router.post("/login", authController.login);
// logout
// router.post("/logout", authHandler, authController.logout);
router.post("/logout", authController.logout);

// refresh
router.get("/refresh", authController.refreshToken);

// * PRODUCT
// create product
router.post("/product", productController.createProduct);
// read all products
router.get("/products", productController.getAllProducts);
// read by featured
router.get("/product/feature/:featured", productController.productByFeature);
// read product by id
router.get("/product/:productid", productController.productByID);

// *! TESTIMONIAL
// read all
// create using postman

// * BLOG
// create (by using postman)
router.post("/blog", authHandler, blogController.create);
// read all blogs
router.get("/blogs", blogController.getAll);
// read by category
router.get("/blog/category/:category", blogController.getBycategory);
// read blog by id
router.get("/blog/:id", blogController.getById);
// update
router.put("/blog", authHandler, blogController.update);
// delete
router.delete("/blog/:id", authHandler, blogController.delete);
// get by featured

// * BLOG COMMENT
// create
router.post("/comment", authHandler, commentController.create);
// read by blog id
router.get("/comment/:id", commentController.getByID);

// * SEARCH PRODUCT
router.get(
	"/search/product/:productname",
	searchProductController.searchProduct
);

// * save image and get url
router.post("/image/post", blogController.postImage);

export default router;
