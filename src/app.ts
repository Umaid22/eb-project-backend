import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";

import { PORT_NO } from "./config";
import { dbConnect } from "./database";
import router from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

const app: Express = express();
const PORT: number = PORT_NO || 5005;

// const allowedOrigins = [
// 	"https://dreamy-fox-52c615.netlify.app/",
// 	"https://fluffy-raindrop-80b223.netlify.app/",
// 	"https://www.yoursite.com",
// 	"http://127.0.0.1:5500",
// 	"http://localhost:3500",
// 	"http://localhost:3000",
// ];

const corsOptions: CorsOptions = {
	// 	origin: function (origin, callback) {
	// 		if (allowedOrigins.indexOf(origin!) !== -1 || !origin) {
	// 			callback(null, true);
	// 		} else {
	// 			callback(
	// 				new Error("By Umaid, customized error, Not allowed by CORS")
	// 			);
	// 		}
	// 	},
	allowedHeaders: ["Content-Type"],
	origin: "*",
	credentials: true,
	// 	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	// 	preflightContinue: true,
	// 	optionsSuccessStatus: 200,
};

app.use(cors());
app.options("*", cors());

// app.use(
// cors({
// 	allowedHeaders: [
// 		"Access-Control-Allow-Origin, https://dreamy-fox-52c615.netlify.app",
// 		"Access-Control-Allow-Headers,Content-Type",
// 	],
// methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
// origin: ["https://dreamy-fox-52c615.netlify.app"],
// optionsSuccessStatus: 200,
// credentials: true,
// })
// );
// app.options(
// "*",
// cors({
// allowedHeaders: [
// 	"Access-Control-Allow-Origin, https://dreamy-fox-52c615.netlify.app",
// 	"Access-Control-Allow-Headers,Content-Type",
// ],
// 		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
// 		origin: ["https://dreamy-fox-52c615.netlify.app"],
// 		optionsSuccessStatus: 200,
// 		credentials: true,
// 	})
// );

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));

dbConnect();

app.use(router);

// first one is the what nedded in path, second is the folder location according to the home
app.use("/storage", express.static("src/storage"));

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`__app is running on port# ${PORT}`);
});
