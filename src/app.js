'use strict';

import http from 'http';
import Router from './common/router/index.js';
import userRouter from './routes/user.route.js';
import { errorHandlerMiddleware } from './common/middleware/error-handler.middleware.js';

/**
 * Create a new application server
 *
 * @returns {http.Server}
 */
export function createApplicationServer() {
    const router = new Router();

    // Set the global prefix path
    router.setGlobalPrefixPath('/api');

    // Register the routes to the router
    router.use(userRouter);

    const server = http.createServer(async (req, res) => {
        try {
            await router.handleRequest(req, res);
        } catch (error) {
            console.log('❌ 에러 발생 ❌');
            console.error(error);

            errorHandlerMiddleware.handleError(error, req, res);
        }
    });

    return server;
}

/**
 * Run the created application server
 * @param {number} port
 * @returns {Promise}
 */
export function runApplicationServer(port) {
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
