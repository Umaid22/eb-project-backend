"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const testimonialSchema = new Schema({
    content: { type: String, required: true },
    author: { type: String, required: true },
    imgpath: { type: String, required: true },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Testimonial", testimonialSchema, "testimonials");
