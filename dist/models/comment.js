"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const commentSchema = new Schema({
    content: { type: String, required: true },
    author: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "User" },
    blogreference: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "Blog" },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Comment", commentSchema, "comments");
