"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogController = void 0;
const joi_1 = __importDefault(require("joi"));
const fs_1 = __importDefault(require("fs"));
const blog_1 = __importDefault(require("../models/blog"));
const config_1 = require("../config");
const blogDto_1 = require("../dto/blogDto");
const blogDetailsDto_1 = require("../dto/blogDetailsDto");
const comment_1 = __importDefault(require("../models/comment"));
const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;
exports.blogController = {
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // * 1. validate request body
            // photo from client-side -> base_64 encoded string -> decode -> store -> save path in db
            const createBlogSchema = joi_1.default.object({
                title: joi_1.default.string().required(),
                content: joi_1.default.string().required(),
                author: joi_1.default.string().regex(mongodbIdPattern).required(),
                tags: joi_1.default.string().required(),
                category: joi_1.default.string().required(),
                featured: joi_1.default.string().required(),
                photo: joi_1.default.string().required(),
            });
            const { error } = createBlogSchema.validate(req.body);
            if (error) {
                return next(error);
            }
            const { title, content, author, tags, photo, category, featured } = req.body;
            // * 2. handle photo storage
            // read as Buffer
            const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""), "base64");
            // alot a random name
            const imageName = `${Date.now()}-${author}.png`;
            // store --> give path according to the home src/storage, this is just for storage
            try {
                fs_1.default.writeFileSync(`src/storage/${imageName}`, buffer);
            }
            catch (error) {
                return next(error);
            }
            // * 3. store data in database
            let savedBlog;
            try {
                savedBlog = new blog_1.default({
                    title,
                    content,
                    author,
                    tags,
                    photoPath: `${config_1.BACKEND_SERVER_PATH}/storage/${imageName}`,
                    category,
                    featured,
                });
                yield savedBlog.save();
            }
            catch (error) {
                return next(error);
            }
            // * 4. response
            const blogDto = new blogDto_1.BlogDTO(savedBlog);
            return res.status(201).json({ blog: blogDto });
        });
    },
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogsAll = yield blog_1.default.find().populate("author");
                let blogs = blogsAll.map((blog) => {
                    return new blogDto_1.BlogDTO(blog);
                });
                res.status(200).send({ blogs });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    getById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const getByIdSchema = joi_1.default.object({
                id: joi_1.default.string().regex(mongodbIdPattern).required(),
            });
            const { error } = getByIdSchema.validate(req.params);
            if (error) {
                return next(error);
            }
            const { id } = req.params;
            try {
                const blog = yield blog_1.default.findOne({ _id: id }).populate("author");
                const blogDto = blog && new blogDetailsDto_1.BlogDetailsDTO(blog);
                return res.status(200).send({ blog: blogDto });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // * 1. validate the request body
            // * 2. get blog from  db(blogs collection)
            // * 3. check if photo is to be update, then perform action describe below steps
            // * 4. if there is no photo then update the blog
            const updateBlogSchema = joi_1.default.object({
                title: joi_1.default.string().required(),
                content: joi_1.default.string().required(),
                photo: joi_1.default.string(),
                blogID: joi_1.default.string().regex(mongodbIdPattern).required(),
                authorID: joi_1.default.string().regex(mongodbIdPattern).required(),
            });
            const { error } = updateBlogSchema.validate(req.body);
            if (error) {
                return next(error);
            }
            const { title, content, photo, blogID, authorID } = req.body;
            let blog;
            try {
                blog = yield blog_1.default.findOne({ _id: blogID });
            }
            catch (error) {
                return next(error);
            }
            if (photo) {
                // * find previous photo path
                let previousPhoto = blog === null || blog === void 0 ? void 0 : blog.photoPath;
                previousPhoto = previousPhoto === null || previousPhoto === void 0 ? void 0 : previousPhoto.split("/").at(-1);
                // * delete photo from storage folder
                try {
                    fs_1.default.unlinkSync(`src/storage/${previousPhoto}`);
                }
                catch (error) {
                    return next(error);
                }
                // * decode the new photo, give it name, save it to the storage folder and then save blog
                const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""), "base64");
                const photoName = `${Date.now()}-${authorID}.png`;
                try {
                    fs_1.default.writeFileSync(`src/storage/${photoName}`, buffer);
                }
                catch (error) {
                    return next(error);
                }
                try {
                    yield blog_1.default.updateOne({ _id: blogID }, {
                        title,
                        content,
                        photoPath: `${config_1.BACKEND_SERVER_PATH}/storage/${photoName}`,
                    });
                }
                catch (error) {
                    return next(error);
                }
            }
            else {
                yield blog_1.default.updateOne({ _id: blogID }, {
                    title,
                    content,
                });
            }
            const updatedBlog = yield blog_1.default.findOne({ _id: blogID }).populate("author");
            const blogDto = updatedBlog && new blogDetailsDto_1.BlogDetailsDTO(updatedBlog);
            return res.status(200).send({ blog: blogDto });
            // return res.status(200).send({ blog: "Blog updated" });
        });
    },
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // * 1. validate the input
            // * 2. delete the blog and comments on that blog
            const deleteBlogSchema = joi_1.default.object({
                id: joi_1.default.string().regex(mongodbIdPattern).required(),
            });
            const { error } = deleteBlogSchema.validate(req.params);
            if (error) {
                return next(error);
            }
            const { id } = req.params;
            try {
                const blogDelete = yield blog_1.default.deleteOne({ _id: id });
                const commentDelete = yield comment_1.default.deleteMany({
                    blogreference: id,
                });
                if (blogDelete.deletedCount) {
                    return res.status(200).json({ message: "Blog deleted" });
                }
                return res.status(401).json({ message: "ID is incorrect" });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    getBycategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const getByIdSchema = joi_1.default.object({
                category: joi_1.default.string().required(),
            });
            const { error } = getByIdSchema.validate(req.params);
            if (error) {
                return next(error);
            }
            const { category } = req.params;
            try {
                const blogsAll = yield blog_1.default.find({
                    featured: category,
                }).populate("author");
                const blogs = blogsAll.map((blog) => {
                    return new blogDto_1.BlogDTO(blog);
                });
                return res.status(200).send({ blogs });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    postImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { photo } = req.body;
            const author = "657431753dc33bfe8b31c75e";
            const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""), "base64");
            // alot a random name
            const imageName = `${Date.now()}-${author}.png`;
            // store --> give path according to the home src/storage, this is just for storage
            try {
                fs_1.default.writeFileSync(`src/storage/${imageName}`, buffer);
                res.status(200).json({
                    photo: `${config_1.BACKEND_SERVER_PATH}/storage/${imageName}`,
                });
            }
            catch (error) {
                return next(error);
            }
        });
    },
};
