import http from 'http';

/**
 * Create a new application server
 *
 * - TODO: Routing
 * - TODO: Middleware
 */
export function createApplicationServer() {
    return http.createServer();
}

/**
 * Run the created application server
 * @param {number} port
 */
export function runApplicationServer(port) {
    const server = createApplicationServer();
    server.listen(port, () => console.log(`Server is Running on PORT ${port}!`));
}
