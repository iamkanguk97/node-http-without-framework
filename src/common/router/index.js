import url from 'url';

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
            const inputRouterMethod = router.routes[method];

            for (const path of inputRouterMethod.keys()) {
                const handler = inputRouterMethod.get(path);
                this.routes[method].set(path, handler);
            }
        });

        return this;
    }

    /**
     * Handle the request object (routing handler)
     * @param {*} req
     * @param {*} res
     */
    handleRequest(req, res) {
        const { method } = req;

        const parsedUrl = url.parse(req.url, true);
        const pathName = parsedUrl.pathname;

        // Set the query-parameter and path-variable into the request object
        req.query = parsedUrl.query;
        req.params = {};

        this.searchRoute(method, pathName);
    }

    /**
     * Search the route from the routing table
     * @param {string} method
     * @param {string} pathName
     */
    searchRoute(method, pathName) {
        const matchedRouteByMethod = this.routes[method];
        console.log(matchedRouteByMethod);
        console.log(pathName);

        // TODO: Error Handling 추가 필요!
        if (!matchedRouteByMethod) {
            throw new Error('Route를 찾지 못했습니다!');
        }

        // Query-Parameter 설정

        // 메서드와 경로 모두 일치하는 경우
        if (matchedRouteByMethod.has(pathName)) {
            const handler = matchedRouteByMethod.get(pathName);
            // executeHandler
            return;
        }

        // 동적 라우팅 매칭
        this.matchDynamicRoute(matchedRouteByMethod, pathName);
    }

    /**
     * Match with dynamic route
     * @example /users/:id
     */
    matchDynamicRoute(routeMap, pathName) {
        console.log(routeMap, pathName);

        for (const [routePath, handlerFunc] of routeMap) {
            console.log(routePath);
            console.log(handlerFunc);
        }
    }
}

export default Router;
