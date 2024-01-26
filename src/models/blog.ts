import mongoose from "mongoose";

const { Schema } = mongoose;

const blogSchema = new Schema(
	{
		title: { type: String, required: true },
		content: { type: String, required: true },
		author: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "User",
			required: true,
		},
		tags: { type: String, required: true },
		category: { type: String, required: true },
		featured: { type: String, required: true },
		photoPath: { type: String, required: true },
	},
	{ timestamps: true }
);

export default mongoose.model("Blog", blogSchema, "blogs");
