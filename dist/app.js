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
const corsOptions = {
    origin: ["https://dreamy-fox-52c615.netlify.app", "http://localhost:3000"],
    credentials: true,
};
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: "50mb" }));
app.use((0, cors_1.default)(corsOptions));
app.use(routes_1.default);
(0, database_1.dbConnect)();
// first one is the what nedded in path, second is the folder location according to the home
app.use("/storage", express_1.default.static("src/storage"));
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`__app is running on port# ${PORT}`);
});
