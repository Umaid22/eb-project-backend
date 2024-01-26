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
exports.productController = void 0;
const joi_1 = __importDefault(require("joi"));
const fs_1 = __importDefault(require("fs"));
const product_1 = __importDefault(require("../models/product"));
const config_1 = require("../config");
exports.productController = {
    createProduct: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // * 1. validation
        // photo from client-side -> base_64 encoded string -> decode -> store -> save path in db
        const createProductSchema = joi_1.default.object({
            title: joi_1.default.string().required(),
            description: joi_1.default.string().required(),
            price: joi_1.default.number().required(),
            rating: joi_1.default.number().required(),
            detail: joi_1.default.string().required(),
            sku: joi_1.default.string().required(),
            category: joi_1.default.string().required(),
            stock: joi_1.default.number().required(),
            farm: joi_1.default.string().required(),
            freshness: joi_1.default.number().required(),
            buyby: joi_1.default.string().required(),
            deliverytime: joi_1.default.number().required(),
            deliveryarea: joi_1.default.string().required(),
            descriptiondetail: joi_1.default.string().required(),
            imgprimary: joi_1.default.string().required(),
            imgsecondary: joi_1.default.string().required(),
            discount: joi_1.default.number().required(),
            freeshipping: joi_1.default.boolean().required(),
            featured: joi_1.default.string().required(),
        });
        const { error } = createProductSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        const { imgprimary, imgsecondary, title, description, price, rating, detail, sku, category, stock, farm, freshness, buyby, deliverytime, deliveryarea, descriptiondetail, discount, freeshipping, featured, } = req.body;
        // * 2. handle photo storage
        function saveImageFunction(title, image) {
            // read as buffer
            const buffer = Buffer.from(image.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""), "base64");
            // alot a name
            const imageName = `${title}-${Date.now()}.png`;
            // store --> give path according to home src/storage
            try {
                fs_1.default.writeFileSync(`src/storage/${imageName}`, buffer);
            }
            catch (error) {
                return next(error);
            }
            return imageName;
        }
        const imgprimaryName = saveImageFunction(title, imgprimary);
        const imgsecondaryName = saveImageFunction(title, imgsecondary);
        // * 3. store in database
        let savedProduct;
        try {
            savedProduct = new product_1.default({
                title,
                description,
                price,
                rating,
                detail,
                sku,
                category,
                stock,
                farm,
                freshness,
                buyby,
                deliverytime,
                deliveryarea,
                descriptiondetail,
                imgprimary: `${config_1.BACKEND_SERVER_PATH}/storage/${imgprimaryName}`,
                imgsecondary: `${config_1.BACKEND_SERVER_PATH}/storage/${imgsecondaryName}`,
                discount,
                freeshipping,
                featured,
            });
            yield savedProduct.save();
        }
        catch (error) {
            return next(error);
        }
        return res.status(201).json({ product: savedProduct });
    }),
    getAllProducts: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        let productsArray;
        try {
            productsArray = yield product_1.default.find();
        }
        catch (error) {
            return next(error);
        }
        return res.status(200).json({ products: productsArray });
    }),
    productByFeature: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { featured } = req.params;
        // console.log("product/feature hitted");
        let productsArray;
        try {
            productsArray = yield product_1.default.find({ featured });
        }
        catch (error) {
            return next(error);
        }
        return res.status(200).json({ product: productsArray });
    }),
    productByID: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { productid } = req.params;
        let singleProduct;
        try {
            singleProduct = yield product_1.default.find({ _id: productid });
        }
        catch (error) {
            return next(error);
        }
        const productObject = singleProduct[0];
        return res.status(200).json({ product: productObject });
    }),
};
