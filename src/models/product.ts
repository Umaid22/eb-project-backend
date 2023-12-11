import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		price: { type: Number, required: true },
		rating: { type: Number, reqired: true },
		detail: { type: String, required: true },
		sku: { type: String, required: true },
		category: { type: String, required: true },
		stock: { type: Number, required: true },
		farm: { type: String, required: true },
		freshness: { type: Number, required: true },
		buyby: { type: String, required: true },
		deliverytime: { type: Number, required: true },
		deliveryarea: { type: String, required: true },
		descriptiondetail: { type: String, required: true },
		imgprimary: { type: String, required: true },
		imgsecondary: { type: String, required: true },
		discount: { type: Number, required: true },
		freeshipping: { type: Boolean, required: true },
		featured: { type: String, required: true },
	},
	{ timestamps: true }
);

export default mongoose.model("Product", productSchema, "products");
