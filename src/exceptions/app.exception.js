import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGE } from './ErrorMessage.js';

export class AppException extends Error {
    constructor(statusCode, errorInfo) {
        super(errorInfo.message);
        this.statusCode = statusCode;
        this.responseCode = errorInfo.responseCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundException extends AppException {
    constructor(message) {
        super(StatusCodes.NOT_FOUND, message);
    }
}

export class RouteNotFoundException extends NotFoundException {
    constructor(message) {
        super(StatusCodes.NOT_FOUND, message);
    }
}

export class MethodNotAllowedException extends AppException {
    constructor() {
        super(StatusCodes.METHOD_NOT_ALLOWED, ERROR_MESSAGE.METHOD_NOT_ALLOWED);
    }
}
