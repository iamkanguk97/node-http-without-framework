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

    const server = http.createServer((req, res) => {
        // TODO: 핸들러에서 발생한 에러에 대한 Handling 추가 필요!
        router.handleRequest(req, res);
    });

    return server;
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
