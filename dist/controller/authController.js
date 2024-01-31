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
exports.authController = void 0;
const joi_1 = __importDefault(require("joi"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../models/user"));
const token_1 = __importDefault(require("../models/token"));
const user_2 = require("../dto/user");
const JWTService_1 = require("../services/JWTService");
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;
const authController = {
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("--register fired :: ", req.body);
            // * 1. validate user input
            const userRegisterSchema = joi_1.default.object({
                username: joi_1.default.string().min(3).max(25).required(),
                email: joi_1.default.string().email().required(),
                password: joi_1.default.string().pattern(passwordPattern).required(),
            });
            const { error } = userRegisterSchema.validate(req.body);
            // * 2. if error in validation --> return error via middleware
            if (error) {
                // console.log("---ERROR:: ", error);
                return next(error);
            }
            // * 3. if email is already registered --> return error
            const { username, email, password } = req.body;
            try {
                const emailInUse = yield user_1.default.exists({ email });
                if (emailInUse) {
                    const error = {
                        status: 409,
                        message: "Email already registered, use another one!",
                    };
                    return next(error);
                }
            }
            catch (error) {
                return next(error);
            }
            // * 4. hash password
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            // * 5. store user data in db & generate tokens
            let accessToken;
            let refreshToken;
            let user;
            try {
                const userToRegister = new user_1.default({
                    username,
                    email,
                    password: hashedPassword,
                });
                user = yield userToRegister.save();
                accessToken = JWTService_1.JWTService.signAccessToken({ _id: user._id }, "60m");
                refreshToken = JWTService_1.JWTService.signRefreshToken({ _id: user._id }, "60m");
            }
            catch (error) {
                return next(error);
            }
            // * send cookies and store refresh token in db
            yield JWTService_1.JWTService.storeRefreshToken(refreshToken, user._id);
            res.cookie("accessToken", accessToken, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });
            res.cookie("refreshToken", refreshToken, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });
            // * 6. return response
            const userDto = new user_2.UserDTO(user);
            return res.status(201).json({ user: userDto, auth: true });
        });
    },
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("--login fired", req.body);
            // * 1. validate user input
            const userLoginSchema = joi_1.default.object({
                email: joi_1.default.string().email().required(),
                password: joi_1.default.string().pattern(passwordPattern).required(),
            });
            const { error } = userLoginSchema.validate(req.body);
            // * 2. if validation error
            if (error) {
                return next(error);
            }
            // * 3. match the email and password
            const { email, password } = req.body;
            let user;
            try {
                user = yield user_1.default.findOne({ email });
                if (!user) {
                    const error = {
                        status: 401,
                        message: "Email not exits!",
                    };
                    return next(error);
                }
            }
            catch (error) {
                return next(error);
            }
            const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
            if (!passwordMatch) {
                const error = {
                    status: 401,
                    message: "Password is incorrect",
                };
                return next(error);
            }
            // * generate tokens & send them in cookie & store/update refresh token in db
            const accessToken = JWTService_1.JWTService.signAccessToken({ _id: user._id }, "60m");
            const refreshToken = JWTService_1.JWTService.signRefreshToken({ _id: user._id }, "60m");
            // console.log(accessToken, refreshToken);
            try {
                // console.log("token updated");
                yield token_1.default.updateOne({ userID: user._id }, { token: refreshToken }, {
                    upsert: true,
                });
            }
            catch (error) {
                // console.log("token not updated");
                return next(error);
            }
            console.log("accessToken from login-handler : ", accessToken);
            const userDto = new user_2.UserDTO(user);
            res.cookie("accessToken", accessToken, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: false,
                sameSite: "none",
                secure: true,
                path: "/",
                domain: "https://dreamy-fox-52c615.netlify.app",
            });
            // next();
            res.cookie("refreshToken", refreshToken, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: false,
                sameSite: "none",
                secure: true,
                path: "/",
                domain: "https://dreamy-fox-52c615.netlify.app",
            });
            // next();
            // * 4. return response
            return res.status(200).json({
                user: userDto,
                auth: true,
                cookie: { accessToken, refreshToken },
            });
        });
    },
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // if(req.cookies)
            // const { refreshToken } = req.cookies["refreshToken"];
            // * 1. delete refresh token from db
            // console.log("refresh cookie from logout-handler : ", refreshToken);
            // try {
            // 	await RefreshToken.deleteOne({ token: refreshToken });
            // } catch (error) {
            // 	console.log("-logout handler : no cookie present in database");
            // 	return next(error);
            // }
            // * 2. delete cookies
            res.clearCookie("refreshToken", {
                path: "/",
                domain: "https://dreamy-fox-52c615.netlify.app",
                secure: true,
                sameSite: "none",
            });
            res.clearCookie("accessToken", {
                path: "/",
                domain: "https://dreamy-fox-52c615.netlify.app",
                secure: true,
                sameSite: "none",
            });
            // * 3. response null
            return res.status(200).json({ user: null, auth: false });
        });
    },
    refreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // * get token from request cookies
            const originalRefreshToken = req.cookies.refreshToken;
            // * 1. verify refresh token
            let id;
            try {
                const response = JWTService_1.JWTService.verifyRefreshToken(originalRefreshToken);
                id = response._id;
            }
            catch (err) {
                const error = {
                    status: 401,
                    message: "Unauthorized",
                };
                return next(error);
            }
            // console.log("___id::", id);
            try {
                const userMatch = yield token_1.default.find({
                    userID: id,
                    token: originalRefreshToken,
                });
                // console.log("---userMatch ::", userMatch);
                if (!userMatch) {
                    const error = {
                        status: 401,
                        message: "Unauthorized - id noth match 'umaid'",
                    };
                    return next(error);
                }
            }
            catch (error) {
                return next(error);
            }
            // * 2. generate new tokens
            // * 3. store new refresh token in db
            // * 4. send tokens in cookies
            try {
                const accessToken = JWTService_1.JWTService.signAccessToken({ _id: id }, "60m");
                const refreshToken = JWTService_1.JWTService.signRefreshToken({ _id: id }, "60m");
                yield token_1.default.updateOne({ userID: id }, { token: refreshToken }
                // {
                // 	upsert: true,
                // }
                );
                res.cookie("accessToken", accessToken, {
                    maxAge: 1000 * 60 * 60 * 24,
                    httpOnly: true,
                });
                res.cookie("refreshToken", refreshToken, {
                    maxAge: 1000 * 60 * 60 * 24,
                    httpOnly: true,
                });
            }
            catch (error) {
                return next(error);
            }
            const userDetails = yield user_1.default.findOne({ _id: id });
            const userDto = userDetails && new user_2.UserDTO(userDetails);
            return res.status(200).json({ user: userDto, auth: true });
        });
    },
};
exports.authController = authController;
