"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = exports.globalErrorHandlerNew = void 0;
const globalErrorHandlerNew = (err, req, res, next) => {
    console.log("here");
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    // Send error response to client
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};
exports.globalErrorHandlerNew = globalErrorHandlerNew;
class AppError extends Error {
    statusCode;
    status;
    isOperational;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
