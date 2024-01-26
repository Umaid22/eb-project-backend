import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import fs from "fs";

import Product from "../models/product";
import { BACKEND_SERVER_PATH } from "../config";

export const productController = {
	createProduct: async (req: Request, res: Response, next: NextFunction) => {
		// * 1. validation
		// photo from client-side -> base_64 encoded string -> decode -> store -> save path in db
		const createProductSchema = Joi.object({
			title: Joi.string().required(),
			description: Joi.string().required(),
			price: Joi.number().required(),
			rating: Joi.number().required(),
			detail: Joi.string().required(),
			sku: Joi.string().required(),
			category: Joi.string().required(),
			stock: Joi.number().required(),
			farm: Joi.string().required(),
			freshness: Joi.number().required(),
			buyby: Joi.string().required(),
			deliverytime: Joi.number().required(),
			deliveryarea: Joi.string().required(),
			descriptiondetail: Joi.string().required(),
			imgprimary: Joi.string().required(),
			imgsecondary: Joi.string().required(),
			discount: Joi.number().required(),
			freeshipping: Joi.boolean().required(),
			featured: Joi.string().required(),
		});

		const { error } = createProductSchema.validate(req.body);
		if (error) {
			return next(error);
		}

		const {
			imgprimary,
			imgsecondary,
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
			discount,
			freeshipping,
			featured,
		} = req.body;

		// * 2. handle photo storage
		function saveImageFunction(title: string, image: string) {
			// read as buffer
			const buffer = Buffer.from(
				image.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
				"base64"
			);

			// alot a name
			const imageName = `${title}-${Date.now()}.png`;

			// store --> give path according to home src/storage
			try {
				fs.writeFileSync(`src/storage/${imageName}`, buffer);
			} catch (error) {
				return next(error);
			}
			return imageName;
		}

		const imgprimaryName = saveImageFunction(title, imgprimary);
		const imgsecondaryName = saveImageFunction(title, imgsecondary);

		// * 3. store in database
		let savedProduct;
		try {
			savedProduct = new Product({
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
				imgprimary: `${BACKEND_SERVER_PATH}/storage/${imgprimaryName}`,
				imgsecondary: `${BACKEND_SERVER_PATH}/storage/${imgsecondaryName}`,
				discount,
				freeshipping,
				featured,
			});

			await savedProduct.save();
		} catch (error) {
			return next(error);
		}

		return res.status(201).json({ product: savedProduct });
	},

	getAllProducts: async (req: Request, res: Response, next: NextFunction) => {
		let productsArray;
		try {
			productsArray = await Product.find();
		} catch (error) {
			return next(error);
		}
		return res.status(200).json({ products: productsArray });
	},

	productByFeature: async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const { featured } = req.params;

		// console.log("product/feature hitted");

		let productsArray;
		try {
			productsArray = await Product.find({ featured });
		} catch (error) {
			return next(error);
		}

		return res.status(200).json({ product: productsArray });
	},

	productByID: async (req: Request, res: Response, next: NextFunction) => {
		const { productid } = req.params;

		let singleProduct;
		try {
			singleProduct = await Product.find({ _id: productid });
		} catch (error) {
			return next(error);
		}
		const productObject = singleProduct[0];

		return res.status(200).json({ product: productObject });
	},
};
