import mongoose from "mongoose";

const { Schema } = mongoose;

const refreshTokenSchema = new Schema(
	{
		token: { type: String, required: true },
		userID: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

export default mongoose.model("RefreshToken", refreshTokenSchema, "tokens");
