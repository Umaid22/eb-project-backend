import { Request, Response, NextFunction } from "express";
import { extendedRequest } from "../../type";
import Joi from "joi";

import Comment from "../models/comment";
import { CommentDTO } from "../dto/commentDto";

const mongodbIDPattern = /^[0-9a-fA-F]{24}$/;

const commentController = {
	async create(req: extendedRequest, res: Response, next: NextFunction) {
		const createCommentSchema = Joi.object({
			content: Joi.string().required(),
			author: Joi.string().regex(mongodbIDPattern).required(),
			blogreference: Joi.string().regex(mongodbIDPattern).required(),
		});
		const { error } = createCommentSchema.validate(req.body);
		if (error) {
			return next(error);
		}
		const { content, author, blogreference } = req.body;
		// console.log("from comment controller :: ", req.user);

		let newComment;
		try {
			newComment = new Comment({
				content,
				author,
				blogreference,
			});
			await newComment.save();
		} catch (error) {
			return next(error);
		}
		return res
			.status(201)
			.json({ comment: newComment, message: "comment created" });
	},

	async getByID(req: Request, res: Response, next: NextFunction) {
		const getByIdSchema = Joi.object({
			id: Joi.string().regex(mongodbIDPattern).required(),
		});
		const { error } = getByIdSchema.validate(req.params);
		if (error) {
			return next(error);
		}
		const { id } = req.params;

		let comments;
		try {
			interface User {
				author: {
					_id: object;
					username: string;
					email: string;
				};
			}

			comments = await Comment.find({ blogreference: id }).populate<User>(
				"author"
			);
		} catch (error) {
			return next(error);
		}

		let commentDto = comments.map((comment) => new CommentDTO(comment));
		return res.status(200).json({ data: commentDto });
	},
};

export { commentController };
