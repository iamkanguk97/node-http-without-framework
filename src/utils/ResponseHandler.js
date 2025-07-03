import { StatusCodes } from 'http-status-codes';

export class ResponseHandler {
    static success(res, data, message) {
        res.writeHead(StatusCodes.OK, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(
            JSON.stringify({
                isSuccess: true,
                data,
                message
            })
        );
    }

    static created(res, data, message) {
        res.writeHead(StatusCodes.CREATED, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(
            JSON.stringify({
                isSuccess: true,
                data,
                message
            })
        );
    }
}
