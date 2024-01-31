import express, { Express } from "express";
import cors, { CorsOptions } from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import { PORT_NO } from "./config";
import { dbConnect } from "./database";
import router from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

const app: Express = express();
const PORT: number = PORT_NO || 5005;

// const allowedOrigins = [
// 	"https://dreamy-fox-52c615.netlify.app/",
// 	"https://www.yoursite.com",
// 	"http://127.0.0.1:5500",
// 	"http://localhost:3500",
// 	"http://localhost:3000",
// ];
// const corsOptions: CorsOptions = {
// 	origin: function (origin, callback) {
// 		if (allowedOrigins.indexOf(origin!) !== -1 || !origin) {
// 			callback(null, true);
// 		} else {
// 			callback(
// 				new Error("By Umaid, customized error, Not allowed by CORS")
// 			);
// 		}
// 	},
// 	allowedHeaders: [
// 		"Access-Control-Allow-Origin",
// 		"Access-Control-Allow-Headers",
// 		"Content-Type",
// 	],
// 	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
// 	// origin: ["https://dreamy-fox-52c615.netlify.app", "http://127.0.0.1:3000"],
// 	preflightContinue: true,
// 	optionsSuccessStatus: 200,
// 	credentials: true,
// };

// app.use(cors({ credentials: true, origin: "http://127.0.0.1:3000" }));
// app.options("*", cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
	cors({
		credentials: true,
		origin: (origin, callback) => {
			// if (!origin || origin === "http://localhost:3000") {
			if (!origin || origin === "https://dreamy-fox-52c615.netlify.app") {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by cors"));
			}
		},
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		allowedHeaders: [
			"Access-Control-Allow-Origin",
			"Access-Control-Allow-Headers",
			"Access-Control-Allow-Methods",
			"Content-Type",
			"Authorization",
		],
		optionsSuccessStatus: 200,
	})
);

app.use(express.json({ limit: "50mb" }));

dbConnect();

// first one is the what nedded in path, second is the folder location according to the home
app.use("/storage", express.static("src/storage"));

app.use(router);

app.use(cookieParser());

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`__app is running on port# ${PORT}`);
});
