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
exports.commentController = void 0;
const joi_1 = __importDefault(require("joi"));
const comment_1 = __importDefault(require("../models/comment"));
const commentDto_1 = require("../dto/commentDto");
const mongodbIDPattern = /^[0-9a-fA-F]{24}$/;
const commentController = {
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("create comment fired");
            const createCommentSchema = joi_1.default.object({
                content: joi_1.default.string().required(),
                author: joi_1.default.string().regex(mongodbIDPattern).required(),
                blogreference: joi_1.default.string().regex(mongodbIDPattern).required(),
            });
            const { error } = createCommentSchema.validate(req.body);
            if (error) {
                return next(error);
            }
            const { content, author, blogreference } = req.body;
            // console.log("from comment controller :: ", req.user);
            let newComment;
            try {
                newComment = new comment_1.default({
                    content,
                    author,
                    blogreference,
                });
                yield newComment.save();
            }
            catch (error) {
                return next(error);
            }
            return res
                .status(201)
                .json({ comment: newComment, message: "comment created" });
        });
    },
    getByID(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const getByIdSchema = joi_1.default.object({
                id: joi_1.default.string().regex(mongodbIDPattern).required(),
            });
            const { error } = getByIdSchema.validate(req.params);
            if (error) {
                return next(error);
            }
            const { id } = req.params;
            let comments;
            try {
                comments = yield comment_1.default.find({ blogreference: id })
                    .populate("author")
                    .populate("blogreference");
            }
            catch (error) {
                return next(error);
            }
            let commentDto = comments.map((comment) => new commentDto_1.CommentDTO(comment));
            return res.status(200).json({ data: commentDto });
            // return res.status(200).json({ data: comments });
        });
    },
};
exports.commentController = commentController;
