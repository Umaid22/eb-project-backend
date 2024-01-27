import { NextFunction, Request, Response } from "express";
import Products from "../models/product";
import SearchProductDto from "../dto/searchProductDTO";

export const searchProductController = {
	searchProduct: async (req: Request, res: Response, next: NextFunction) => {
		const { productname } = req.params;
		let products;
		try {
			const regex = new RegExp(productname, "i");
			products = await Products.find({ title: { $regex: regex } });
		} catch (error) {
			return next(error);
		}
		// console.log(products);
		const titleArray = products.map((product) => {
			return new SearchProductDto(product);
		});
		res.status(200).json({ title: titleArray });
	},
};
