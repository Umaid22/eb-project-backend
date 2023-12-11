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
exports.authHandler = void 0;
const JWTService_1 = require("../services/JWTService");
const user_1 = __importDefault(require("../models/user"));
const user_2 = require("../dto/user");
const authHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accessToken, refreshToken } = req.cookies;
        if (!accessToken || !refreshToken) {
            const error = {
                status: 401,
                message: "Unauthorized",
            };
            return next(error);
        }
        // * 1. verify Tokens
        let _id;
        try {
            _id = JWTService_1.JWTService.verifyAccessToken(accessToken);
        }
        catch (error) {
            return next(error);
        }
        // console.log("---from auth handler ::", _id);
        // * 2. get user details from db using _id taken from token
        let userDetail;
        try {
            userDetail = yield user_1.default.findOne({ _id: _id });
        }
        catch (error) {
            return next(error);
        }
        // console.log("---from auth handler - user ::", userDetail);
        // * 3. send details to respective handler
        let userDto;
        if (userDetail) {
            userDto = new user_2.UserDTO(userDetail);
            req.user = userDto;
        }
        next();
    }
    catch (error) {
        return next(error);
    }
});
exports.authHandler = authHandler;
