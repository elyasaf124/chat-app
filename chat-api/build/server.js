"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
exports.server = http_1.default.createServer(app_1.default);
const DB = process.env.DATABASE;
console.log(process.env.DATABASE);
mongoose_1.default
    .connect(DB)
    .then(() => {
    console.log("MongoDB connected");
})
    .catch((err) => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    process.exit();
});
const port = 3000;
exports.server.listen(port, () => {
    console.log(`App running on port ${port}`);
});
