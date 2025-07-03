'use strict';

import http from 'http';
import Router from './common/router/index.js';
import userRouter from './routes/UserRoute.js';
import movieRouter from './routes/MovieRoute.js';
import { errorHandlerMiddleware } from './common/middleware/ErrorHandlerMiddleware.js';

export function setRouterOptions(router) {
    // Set global prefix path
    router.setGlobalPrefixPath('/api');

    // Register these routes to the router
    router.use(userRouter);
    router.use(movieRouter);
}

export function createApplicationServer() {
    const router = new Router();
    setRouterOptions(router);

    return http.createServer((req, res) => {
        router
            .handleRequest(req, res)
            .then(() => {})
            .catch((error) => {
                console.log('❌ 에러 발생 ❌');
                console.error(error);
                errorHandlerMiddleware.handleError(error, req, res);
            });
    });
}

export async function runApplicationServer(port) {
    return new Promise((resolve, reject) => {
        try {
            const server = createApplicationServer();

            server.listen(port, () => {
                console.log(`🏃 Server is Running on PORT ${port}! 🏃`);
                resolve();
            });
        } catch (error) {
            reject(error);
        }
    });
}
