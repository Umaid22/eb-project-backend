"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const database_1 = require("./database");
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const app = (0, express_1.default)();
const PORT = config_1.PORT_NO || 5005;
const allowedOrigins = [
    "https://dreamy-fox-52c615.netlify.app/",
    "https://fluffy-raindrop-80b223.netlify.app/",
    "https://www.yoursite.com",
    "http://127.0.0.1:5500",
    "http://localhost:3500",
    "http://localhost:3000",
];
const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: "Content-Type,application/json",
};
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: "50mb" }));
app.use((0, cors_1.default)(corsOptions));
// app.options("*", cors(corsOptions));
(0, database_1.dbConnect)();
app.use(routes_1.default);
// first one is the what nedded in path, second is the folder location according to the home
app.use("/storage", express_1.default.static("src/storage"));
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`__app is running on port# ${PORT}`);
});
