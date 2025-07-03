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
    constructor(errorInfo) {
        super(StatusCodes.NOT_FOUND, errorInfo ?? ERROR_MESSAGE.NOT_FOUND);
    }
}

export class RouteNotFoundException extends NotFoundException {
    constructor() {
        super(ERROR_MESSAGE.ROUTE_NOT_FOUND);
    }
}

export class MethodNotAllowedException extends AppException {
    constructor() {
        super(StatusCodes.METHOD_NOT_ALLOWED, ERROR_MESSAGE.METHOD_NOT_ALLOWED);
    }
}

export class InternalServerErrorException extends AppException {
    constructor(errorInfo) {
        super(StatusCodes.INTERNAL_SERVER_ERROR, errorInfo ?? ERROR_MESSAGE.INTERNAL_SERVER_ERROR);
    }
}
