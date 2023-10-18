import { Request, Response, NextFunction } from "express";
import { extendedRequest } from "../../type";
import Joi, { string } from "joi";
import bcrypt from "bcryptjs";

import User from "../models/user";
import RefreshToken from "../models/token";
import { UserDTO } from "../dto/user";
import { JWTService } from "../services/JWTService";
import { JwtPayload } from "jsonwebtoken";

const passwordPattern: RegExp =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const authController = {
	async register(req: Request, res: Response, next: NextFunction) {
		// console.log("---register-body :: ", req.body);

		// * 1. validate user input
		const userRegisterSchema = Joi.object({
			username: Joi.string().min(3).max(25).required(),
			email: Joi.string().email().required(),
			password: Joi.string().pattern(passwordPattern).required(),
		});
		const { error } = userRegisterSchema.validate(req.body);

		// * 2. if error in validation --> return error via middleware
		if (error) {
			// console.log("---ERROR:: ", error);
			return next(error);
		}

		// * 3. if email is already registered --> return error
		const { username, email, password } = req.body;
		try {
			const emailInUse = await User.exists({ email });
			if (emailInUse) {
				const error = {
					status: 409,
					message: "Email already registered, use another one!",
				};
				return next(error);
			}
		} catch (error) {
			return next(error);
		}

		// * 4. hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// * 5. store user data in db & generate tokens
		let accessToken;
		let refreshToken;
		let user;
		try {
			const userToRegister = new User({
				username,
				email,
				password: hashedPassword,
			});
			user = await userToRegister.save();

			accessToken = JWTService.signAccessToken({ _id: user._id }, "60m");
			refreshToken = JWTService.signRefreshToken(
				{ _id: user._id },
				"60m"
			);
		} catch (error) {
			return next(error);
		}

		// * send cookies and store refresh token in db
		await JWTService.storeRefreshToken(refreshToken, user._id);

		res.cookie("accessToken", accessToken, {
			maxAge: 1000 * 60 * 60 * 24,
			httpOnly: true,
		});
		res.cookie("refreshToken", refreshToken, {
			maxAge: 1000 * 60 * 60 * 24,
			httpOnly: true,
		});

		// * 6. return response
		const userDto = new UserDTO(user);
		return res.status(201).json({ user: userDto, auth: true });
	},

	async login(req: Request, res: Response, next: NextFunction) {
		// * 1. validate user input
		const userLoginSchema = Joi.object({
			email: Joi.string().email().required(),
			password: Joi.string().pattern(passwordPattern).required(),
		});
		const { error } = userLoginSchema.validate(req.body);

		// * 2. if validation error
		if (error) {
			return next(error);
		}

		// * 3. match the email and password
		const { email, password } = req.body;
		let user;

		try {
			user = await User.findOne({ email });
			if (!user) {
				const error = {
					status: 401,
					message: "Email not exits!",
				};
				return next(error);
			}
		} catch (error) {
			return next(error);
		}

		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			const error = {
				status: 401,
				message: "Password is incorrect",
			};
			return next(error);
		}

		// * generate tokens & send them in cookie & store/update refresh token in db
		const accessToken = JWTService.signAccessToken(
			{ _id: user._id },
			"60m"
		);
		const refreshToken = JWTService.signRefreshToken(
			{ _id: user._id },
			"60m"
		);

		try {
			await RefreshToken.updateOne(
				{ userID: user._id },
				{ token: refreshToken },
				{
					upsert: true,
				}
			);
		} catch (error) {
			return next(error);
		}

		res.cookie("accessToken", accessToken, {
			maxAge: 1000 * 60 * 60 * 24,
			httpOnly: true,
		});
		res.cookie("refreshToken", refreshToken, {
			maxAge: 1000 * 60 * 60 * 24,
			httpOnly: true,
		});

		// * 4. return response
		const userDto = new UserDTO(user);
		return res.status(200).json({ user: userDto, auth: true });
	},

	async logout(req: extendedRequest, res: Response, next: NextFunction) {
		const { refreshToken } = req.cookies;
		// * 1. delete refresh token from db
		try {
			await RefreshToken.deleteOne({ token: refreshToken });
		} catch (error) {
			return next(error);
		}
		// * 2. delete cookies
		res.clearCookie("refreshToken");
		res.clearCookie("accessToken");
		// * 3. response null
		return res.status(200).json({ user: null, auth: false });
	},

	async refreshToken(req: Request, res: Response, next: NextFunction) {
		// * get token from request cookies
		const originalRefreshToken = req.cookies.refreshToken;

		// * 1. verify refresh token
		let id;
		try {
			const response =
				JWTService.verifyRefreshToken(originalRefreshToken);
			id = (<{ _id: string }>response)._id;
		} catch (err) {
			const error = {
				status: 401,
				message: "Unauthorized",
			};
			return next(error);
		}
		// console.log("___id::", id);

		try {
			const userMatch = await RefreshToken.find({
				userID: id,
				token: originalRefreshToken,
			});
			// console.log("---userMatch ::", userMatch);
			if (!userMatch) {
				const error = {
					status: 401,
					message: "Unauthorized - id noth match 'umaid'",
				};
				return next(error);
			}
		} catch (error) {
			return next(error);
		}

		// * 2. generate new tokens
		// * 3. store new refresh token in db
		// * 4. send tokens in cookies

		try {
			const accessToken = JWTService.signAccessToken({ _id: id }, "60m");
			const refreshToken = JWTService.signRefreshToken(
				{ _id: id },
				"60m"
			);

			await RefreshToken.updateOne(
				{ userID: id },
				{ token: refreshToken }
				// {
				// 	upsert: true,
				// }
			);

			res.cookie("accessToken", accessToken, {
				maxAge: 1000 * 60 * 60 * 24,
				httpOnly: true,
			});
			res.cookie("refreshToken", refreshToken, {
				maxAge: 1000 * 60 * 60 * 24,
				httpOnly: true,
			});
		} catch (error) {
			return next(error);
		}

		const userDetails = await User.findOne({ _id: id });
		const userDto = userDetails && new UserDTO(userDetails);
		return res.status(200).json({ user: userDto, auth: true });
	},
};

export { authController };
