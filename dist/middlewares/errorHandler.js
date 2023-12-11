"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const joi_1 = require("joi");
const errorHandler = (error, req, res, next) => {
    // DEFAULT ERROR
    let status = 500;
    let data = {
        message: "Internal Server Error",
    };
    if (error instanceof joi_1.ValidationError) {
        status = 401;
        data.message = error.message;
        return res.status(status).json(data);
    }
    if (error.status) {
        status = error.status;
    }
    if (error.message) {
        data.message = error.message;
    }
    return res.status(status).json(data);
};
exports.errorHandler = errorHandler;
