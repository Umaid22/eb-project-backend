"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BACKEND_SERVER_PATH = exports.REFRESH_TOKEN_SECERET = exports.ACCESS_TOKEN_SECERET = exports.MONGODB_URL = exports.PORT_NO = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT_NO = Number(process.env.PORT);
exports.MONGODB_URL = process.env.MONGODB_URL;
exports.ACCESS_TOKEN_SECERET = process.env.ACCESS_TOKEN_SECERET;
exports.REFRESH_TOKEN_SECERET = process.env.REFRESH_TOKEN_SECERET;
exports.BACKEND_SERVER_PATH = process.env.BACKEND_SERVER_PATH;
