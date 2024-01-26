import mongoose from "mongoose";
import { MONGODB_URL } from "../config";

export const dbConnect = async () => {
  try {
    const dbConnectRes = await mongoose.connect(MONGODB_URL);
    console.log(`__mongodb_connect_SUCCESS : ${dbConnectRes.connection.host}`);
  } catch (error) {
    console.log(`--mongodb_connect_ERROR : ${error}`);
  }
};
