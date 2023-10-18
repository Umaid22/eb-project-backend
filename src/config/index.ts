import dotenv from "dotenv";

dotenv.config();

export const PORT_NO: number = Number(process.env.PORT);
export const MONGODB_URL: string = process.env.MONGODB_URL!;
export const ACCESS_TOKEN_SECERET = process.env.ACCESS_TOKEN_SECERET!;
export const REFRESH_TOKEN_SECERET = process.env.REFRESH_TOKEN_SECERET!;
export const BACKEND_SERVER_PATH = process.env.BACKEND_SERVER_PATH;
