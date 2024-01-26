"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controller/authController");
const blogController_1 = require("../controller/blogController");
const commentController_1 = require("../controller/commentController");
const productController_1 = require("../controller/productController");
const authHandler_1 = require("../middlewares/authHandler");
const searchProductController_1 = require("../controller/searchProductController");
const router = express_1.default.Router();
// * TESTING
router.get("/", (req, res) => res.json({ message: "This end point is for test and its working.." }));
// * USER
// register
router.post("/register", authController_1.authController.register);
// login
router.post("/login", authController_1.authController.login);
// logout
router.post("/logout", authHandler_1.authHandler, authController_1.authController.logout);
// refresh
router.get("/refresh", authController_1.authController.refreshToken);
// * PRODUCT
// create product
router.post("/product", productController_1.productController.createProduct);
// read all products
router.get("/products", productController_1.productController.getAllProducts);
// read by featured
router.get("/product/feature/:featured", productController_1.productController.productByFeature);
// read product by id
router.get("/product/:productid", productController_1.productController.productByID);
// *! TESTIMONIAL
// read all
// create using postman
// * BLOG
// create (by using postman)
router.post("/blog", authHandler_1.authHandler, blogController_1.blogController.create);
// read all blogs
router.get("/blogs", blogController_1.blogController.getAll);
// read by category
router.get("/blog/category/:category", blogController_1.blogController.getBycategory);
// read blog by id
router.get("/blog/:id", blogController_1.blogController.getById);
// update
router.put("/blog", authHandler_1.authHandler, blogController_1.blogController.update);
// delete
router.delete("/blog/:id", authHandler_1.authHandler, blogController_1.blogController.delete);
// get by featured
// * BLOG COMMENT
// create
router.post("/comment", authHandler_1.authHandler, commentController_1.commentController.create);
// read by blog id
router.get("/comment/:id", commentController_1.commentController.getByID);
// * SEARCH PRODUCT
router.get("/search/product/:productname", searchProductController_1.searchProductController.searchProduct);
// * save image and get url
router.post("/image/post", blogController_1.blogController.postImage);
exports.default = router;
