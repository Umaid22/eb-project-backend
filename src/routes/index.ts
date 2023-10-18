import express from "express";

import { authController } from "../controller/authController";
import { blogController } from "../controller/blogController";
import { commentController } from "../controller/commentController";
import { authHandler } from "../middlewares/authHandler";

const router = express.Router();

// * TESTING
router.get("/test", (req, res) => res.json({ msg: "test working" }));

// * USER
// register
router.post("/register", authController.register);
// login
router.post("/login", authController.login);
// logout
router.post("/logout", authHandler, authController.logout);
// refresh
router.get("/refresh", authController.refreshToken);

// *! PRODUCT
// read all products
// read product by id

// *! TESTIMONIAL
// read all
// create using postman

// * BLOG
// create (by using postman)
router.post("/blog", authHandler, blogController.create);
// read all blogs
router.get("/blogs", authHandler, blogController.getAll);
// read blog by id
router.get("/blog/:id", authHandler, blogController.getById);
// update
router.put("/blog", authHandler, blogController.update);
// delete
router.delete("/blog/:id", authHandler, blogController.delete);

// * BLOG COMMENT
// create
router.post("/comment", authHandler, commentController.create);
// read by blog id
router.get("/comment/:id", authHandler, commentController.getByID);

export default router;
