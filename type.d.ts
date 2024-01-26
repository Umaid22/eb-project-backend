import { Secret } from "jsonwebtoken";
import { Request } from "express";

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PORT: string;
			MONGODB_URL: string;
			ACCESS_TOKEN_SECERET: Secret;
			REFRESH_TOKEN_SECERET: Secret;
			BACKEND_SERVER_PATH: string;
		}
	}
}

interface extendedRequest extends Request {
	user?: {
		_id: object;
		username: string;
		email: string;
	};
}

export { extendedRequest };
