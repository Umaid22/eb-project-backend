import { Response, NextFunction } from "express";
import { extendedRequest } from "../../type";

import { JWTService } from "../services/JWTService";
import User from "../models/user";
import { UserDTO } from "../dto/user";

const authHandler = async (
	req: extendedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const { accessToken, refreshToken } = req.cookies;

		if (!accessToken || !refreshToken) {
			// console.log("middleware autho controller...");
			const error = {
				status: 401,
				message: "Unauthorized",
			};
			return next(error);
		}

		// * 1. verify Tokens
		let _id;
		try {
			_id = JWTService.verifyAccessToken(accessToken);
		} catch (error) {
			return next(error);
		}
		// console.log("---from auth handler ::", _id);

		// * 2. get user details from db using _id taken from token
		let userDetail;
		try {
			userDetail = await User.findOne({ _id: _id });
		} catch (error) {
			return next(error);
		}
		// console.log("---from auth handler - user ::", userDetail);

		// * 3. send details to respective handler
		let userDto;
		if (userDetail) {
			userDto = new UserDTO(userDetail);
			req.user = userDto;
		}

		next();
	} catch (error) {
		return next(error);
	}
};

export { authHandler };
