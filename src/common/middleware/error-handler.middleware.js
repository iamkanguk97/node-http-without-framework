'use strict';

import { StatusCodes } from 'http-status-codes';
import { ERROR_MESSAGE } from '../../exceptions/ErrorMessage.js';
import { appConfig } from '../../configs/app.config.js';
import dayjs from 'dayjs';

export class ErrorHandlerMiddleware {
    /**
     * Handling Error Response
     * @param {Error} error
     * @param {Request} req
     * @param {Response} res
     */
    handleError(error, req, res) {
        const statusCode = this.getStatusCodeFromResponse(error);
        const message = this.getMessageFromResponse(error);
        const responseCode = this.getCodeFromResponse(error);
        const userAgent = this.getUserAgentFromRequest(req);

        res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(
            JSON.stringify({
                isSuccess: false,
                error: {
                    message,
                    responseCode,
                    ...(appConfig.NODE_ENV === 'develop' && {
                        stack: error.stack
                    })
                },
                timestamp: dayjs(),
                userAgent
            })
        );
    }

    getStatusCodeFromResponse(error) {
        return error.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
    }

    getMessageFromResponse(error) {
        return error.message ?? ERROR_MESSAGE.UNCATCHED_ERROR.message;
    }

    getCodeFromResponse(error) {
        return error.responseCode ?? ERROR_MESSAGE.UNCATCHED_ERROR.responseCode;
    }

    getUserAgentFromRequest(req) {
        return req.headers['user-agent'] ?? 'Unknown';
    }
}

export const errorHandlerMiddleware = new ErrorHandlerMiddleware();
