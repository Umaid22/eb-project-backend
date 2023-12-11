import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { PORT_NO } from "./config";
import { dbConnect } from "./database";
import router from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

const app: Express = express();
const PORT: number = PORT_NO || 5005;
const corsOptions = {
	origin: ["https://fluffy-raindrop-80b223.netlify.app/"],
	credentials: true,
};

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(cors(corsOptions));
app.use(router);

dbConnect();

// first one is the what nedded in path, second is the folder location according to the home
app.use("/storage", express.static("src/storage"));

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`__app is running on port# ${PORT}`);
});
