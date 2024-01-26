"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const refreshTokenSchema = new Schema({
    token: { type: String, required: true },
    userID: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "User" },
}, { timestamps: true });
exports.default = mongoose_1.default.model("RefreshToken", refreshTokenSchema, "tokens");
