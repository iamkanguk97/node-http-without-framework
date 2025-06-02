class Router {
    constructor() {
        this.routes = {
            GET: new Map(),
            POST: new Map(),
            PUT: new Map(),
            DELETE: new Map()
        };
    }

    /**
     * HTTP GET Method Handler
     * @param {string} path
     * @param {Function} handler
     */
    get(path, handler) {
        this.routes.GET.set(path, handler);
        return this;
    }

    /**
     * HTTP POST Method Handler
     * @param {string} path
     * @param {Function} handler
     */
    post(path, handler) {
        this.routes.POST.set(path, handler);
        return this;
    }

    /**
     * HTTP PUT Method Handler
     * @param {string} path
     * @param {Function} handler
     */
    put(path, handler) {
        this.routes.PUT.set(path, handler);
        return this;
    }

    /**
     * HTTP DELETE Method Handler
     * @param {string} path
     * @param {Function} handler
     */
    delete(path, handler) {
        this.routes.DELETE.set(path, handler);
        return this;
    }

    /**
     * Register the routes to the router
     * @param {Router} router
     */
    use(router) {
        Object.keys(this.routes).forEach(method => {
            router.routes[method].keys().forEach(path => {
                const handler = router.routes[method].get(path);
                this.routes[method].set(path, handler);
            });
        });

        return this;
    }
}

export default Router;
