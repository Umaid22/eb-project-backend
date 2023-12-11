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
exports.searchProductController = void 0;
const product_1 = __importDefault(require("../models/product"));
const searchProductDTO_1 = __importDefault(require("../dto/searchProductDTO"));
exports.searchProductController = {
    searchProduct: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { productname } = req.params;
        let products;
        try {
            const regex = new RegExp(productname, "i");
            products = yield product_1.default.find({ title: { $regex: regex } });
        }
        catch (error) {
            return next(error);
        }
        const titleArray = products.map((product) => {
            return new searchProductDTO_1.default(product);
        });
        res.status(200).json({ title: titleArray });
    }),
};
