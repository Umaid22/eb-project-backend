"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, reqired: true },
    detail: { type: String, required: true },
    sku: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    farm: { type: String, required: true },
    freshness: { type: Number, required: true },
    buyby: { type: String, required: true },
    deliverytime: { type: Number, required: true },
    deliveryarea: { type: String, required: true },
    descriptiondetail: { type: String, required: true },
    imgprimary: { type: String, required: true },
    imgsecondary: { type: String, required: true },
    discount: { type: Number, required: true },
    freeshipping: { type: Boolean, required: true },
    featured: { type: String, required: true },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Product", productSchema, "products");
