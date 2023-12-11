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
exports.JWTService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const token_1 = __importDefault(require("../models/token"));
class JWTService {
    // * sign access token
    static signAccessToken(payload, expiryTime) {
        return jsonwebtoken_1.default.sign(payload, config_1.ACCESS_TOKEN_SECERET, {
            expiresIn: expiryTime,
        });
    }
    // * sign refresh token
    static signRefreshToken(payload, expiryTime) {
        return jsonwebtoken_1.default.sign(payload, config_1.REFRESH_TOKEN_SECERET, {
            expiresIn: expiryTime,
        });
    }
    // * verify access token
    static verifyAccessToken(token) {
        return jsonwebtoken_1.default.verify(token, config_1.ACCESS_TOKEN_SECERET);
    }
    // * verify refresh token
    static verifyRefreshToken(token) {
        return jsonwebtoken_1.default.verify(token, config_1.REFRESH_TOKEN_SECERET);
    }
    // * store refresh token
    static storeRefreshToken(token, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenToStore = new token_1.default({
                    token,
                    userID,
                });
                yield tokenToStore.save();
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.JWTService = JWTService;
