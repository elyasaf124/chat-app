"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const appError_1 = require("./utilitis/appError");
const app = (0, express_1.default)();
exports.default = app;
exports.corsOptions = {
    credentials: true,
    origin: ["http://localhost:3001"],
    optionsSuccessStatus: 200,
};
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(exports.corsOptions));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(appError_1.globalErrorHandlerNew);
