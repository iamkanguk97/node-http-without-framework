import http from 'http';
import Router from './common/router/index.js';
import userRouter from './routes/user.route.js';

/**
 * Create a new application server
 *
 * - TODO: Middleware
 */
export function createApplicationServer() {
    const router = new Router();

    // Register the routes to the router
    router.use(userRouter);

    return http.createServer();
}

/**
 * Run the created application server
 * @param {number} port
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
