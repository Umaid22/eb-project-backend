import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import fs from "fs";

import Blog from "../models/blog";
import { BACKEND_SERVER_PATH } from "../config";
import { BlogDTO } from "../dto/blogDto";
import { BlogDetailsDTO } from "../dto/blogDetailsDto";
import Comment from "../models/comment";

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

export const blogController = {
	async create(req: Request, res: Response, next: NextFunction) {
		// * 1. validate request body
		// photo from client-side -> base_64 encoded string -> decode -> store -> save path in db

		const createBlogSchema = Joi.object({
			title: Joi.string().required(),
			content: Joi.string().required(),
			author: Joi.string().regex(mongodbIdPattern).required(),
			tags: Joi.string().required(),
			category: Joi.string().required(),
			featured: Joi.string().required(),
			photo: Joi.string().required(),
		});
		const { error } = createBlogSchema.validate(req.body);
		if (error) {
			return next(error);
		}

		const { title, content, author, tags, photo, category, featured } =
			req.body;

		// * 2. handle photo storage
		// read as Buffer
		const buffer = Buffer.from(
			photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
			"base64"
		);

		// alot a random name
		const imageName = `${Date.now()}-${author}.png`;

		// store --> give path according to the home src/storage, this is just for storage
		try {
			fs.writeFileSync(`src/storage/${imageName}`, buffer);
		} catch (error) {
			return next(error);
		}

		// * 3. store data in database
		let savedBlog;
		try {
			savedBlog = new Blog({
				title,
				content,
				author,
				tags,
				photoPath: `${BACKEND_SERVER_PATH}/storage/${imageName}`,
				category,
				featured,
			});
			await savedBlog.save();
		} catch (error) {
			return next(error);
		}

		// * 4. response
		const blogDto = new BlogDTO(savedBlog);
		return res.status(201).json({ blog: blogDto });
	},

	async getAll(req: Request, res: Response, next: NextFunction) {
		interface User {
			author: {
				_id: object;
				username: string;
				email: string;
			};
		}
		try {
			const blogsAll = await Blog.find().populate<User>("author");
			let blogs = blogsAll.map((blog) => {
				return new BlogDTO(blog);
			});
			res.status(200).send({ blogs });
		} catch (error) {
			return next(error);
		}
	},

	async getById(req: Request, res: Response, next: NextFunction) {
		const getByIdSchema = Joi.object({
			id: Joi.string().regex(mongodbIdPattern).required(),
		});
		const { error } = getByIdSchema.validate(req.params);
		if (error) {
			return next(error);
		}

		const { id } = req.params;

		interface User {
			author: {
				_id: object;
				username: string;
				email: string;
			};
		}

		try {
			const blog = await Blog.findOne({ _id: id }).populate<User>(
				"author"
			);
			const blogDto = blog && new BlogDetailsDTO(blog);
			return res.status(200).send({ blog: blogDto });
		} catch (error) {
			return next(error);
		}
	},

	async update(req: Request, res: Response, next: NextFunction) {
		// * 1. validate the request body
		// * 2. get blog from  db(blogs collection)
		// * 3. check if photo is to be update, then perform action describe below steps
		// * 4. if there is no photo then update the blog

		const updateBlogSchema = Joi.object({
			title: Joi.string().required(),
			content: Joi.string().required(),
			photo: Joi.string(),
			blogID: Joi.string().regex(mongodbIdPattern).required(),
			authorID: Joi.string().regex(mongodbIdPattern).required(),
		});
		const { error } = updateBlogSchema.validate(req.body);
		if (error) {
			return next(error);
		}

		const { title, content, photo, blogID, authorID } = req.body;
		let blog;

		try {
			blog = await Blog.findOne({ _id: blogID });
		} catch (error) {
			return next(error);
		}

		if (photo) {
			// * find previous photo path
			let previousPhoto = blog?.photoPath;
			previousPhoto = previousPhoto?.split("/").at(-1);

			// * delete photo from storage folder
			try {
				fs.unlinkSync(`src/storage/${previousPhoto}`);
			} catch (error) {
				return next(error);
			}

			// * decode the new photo, give it name, save it to the storage folder and then save blog
			const buffer = Buffer.from(
				photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
				"base64"
			);
			const photoName = `${Date.now()}-${authorID}.png`;

			try {
				fs.writeFileSync(`src/storage/${photoName}`, buffer);
			} catch (error) {
				return next(error);
			}

			try {
				await Blog.updateOne(
					{ _id: blogID },
					{
						title,
						content,
						photoPath: `${BACKEND_SERVER_PATH}/storage/${photoName}`,
					}
				);
			} catch (error) {
				return next(error);
			}
		} else {
			await Blog.updateOne(
				{ _id: blogID },
				{
					title,
					content,
				}
			);
		}

		interface User {
			author: {
				username: string;
				email: string;
				_id: object;
			};
		}
		const updatedBlog = await Blog.findOne({ _id: blogID }).populate<User>(
			"author"
		);
		const blogDto = updatedBlog && new BlogDetailsDTO(updatedBlog);

		return res.status(200).send({ blog: blogDto });
		// return res.status(200).send({ blog: "Blog updated" });
	},

	async delete(req: Request, res: Response, next: NextFunction) {
		// * 1. validate the input
		// * 2. delete the blog and comments on that blog
		const deleteBlogSchema = Joi.object({
			id: Joi.string().regex(mongodbIdPattern).required(),
		});
		const { error } = deleteBlogSchema.validate(req.params);
		if (error) {
			return next(error);
		}
		const { id } = req.params;

		try {
			const blogDelete = await Blog.deleteOne({ _id: id });
			const commentDelete = await Comment.deleteMany({
				blogreference: id,
			});

			if (blogDelete.deletedCount) {
				return res.status(200).json({ message: "Blog deleted" });
			}
			return res.status(401).json({ message: "ID is incorrect" });
		} catch (error) {
			return next(error);
		}
	},

	async getBycategory(req: Request, res: Response, next: NextFunction) {
		const getByIdSchema = Joi.object({
			category: Joi.string().required(),
		});

		const { error } = getByIdSchema.validate(req.params);
		if (error) {
			return next(error);
		}

		const { category } = req.params;

		interface User {
			author: {
				_id: object;
				username: string;
				email: string;
			};
		}

		try {
			const blogsAll = await Blog.find({
				featured: category,
			}).populate<User>("author");
			const blogs = blogsAll.map((blog) => {
				return new BlogDTO(blog);
			});
			return res.status(200).send({ blogs });
		} catch (error) {
			return next(error);
		}
	},

	async postImage(req: Request, res: Response, next: NextFunction) {
		const { photo } = req.body;
		const author = "657431753dc33bfe8b31c75e";

		const buffer = Buffer.from(
			photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
			"base64"
		);

		// alot a random name
		const imageName = `${Date.now()}-${author}.png`;

		// store --> give path according to the home src/storage, this is just for storage
		try {
			fs.writeFileSync(`src/storage/${imageName}`, buffer);
			res.status(200).json({
				photo: `${BACKEND_SERVER_PATH}/storage/${imageName}`,
			});
		} catch (error) {
			return next(error);
		}
	},
};
