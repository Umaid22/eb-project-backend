import jwt, { Secret } from "jsonwebtoken";

import { ACCESS_TOKEN_SECERET, REFRESH_TOKEN_SECERET } from "../config";
import RefreshToken from "../models/token";

class JWTService {
	// * sign access token
	static signAccessToken(payload: object, expiryTime: string) {
		return jwt.sign(payload, ACCESS_TOKEN_SECERET, {
			expiresIn: expiryTime,
		});
	}
	// * sign refresh token
	static signRefreshToken(payload: object, expiryTime: string) {
		return jwt.sign(payload, REFRESH_TOKEN_SECERET, {
			expiresIn: expiryTime,
		});
	}
	// * verify access token
	static verifyAccessToken(token: string) {
		return jwt.verify(token, ACCESS_TOKEN_SECERET);
	}
	// * verify refresh token
	static verifyRefreshToken(token: string) {
		return jwt.verify(token, REFRESH_TOKEN_SECERET);
	}
	// * store refresh token
	static async storeRefreshToken(token: Secret, userID: object) {
		try {
			const tokenToStore = new RefreshToken({
				token,
				userID,
			});
			await tokenToStore.save();
		} catch (error) {
			console.log(error);
		}
	}
}

export { JWTService };
