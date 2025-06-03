import url from 'url';
import { getPathSegmentList } from '../../utils/router.util.js';

class Router {
  constructor() {
    this.routes = {
      GET: new Map(),
      POST: new Map(),
      PUT: new Map(),
      DELETE: new Map(),
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
    Object.keys(this.routes).forEach((method) => {
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

    // Parse the request url
    const parsedUrl = url.parse(req.url, true);
    const pathName = parsedUrl.pathname;

    // Set the query-parameter and path-variable(default) into the request object
    req.query = parsedUrl.query;
    req.params = {};

    /**
     * Match the request path with routing map
     * Get the path-variable from the request path
     */
    const searchRouteResult = this.searchRoute(method, pathName);

    if (searchRouteResult) {
      const { params, handlerFunc } = searchRouteResult;
      req.params = params;

      // Execute the handler function
      handlerFunc(req, res);
    }
  }

  /**
   * Search the route from the routing table
   * @param {string} method
   * @param {string} pathName
   * @returns {Object | null} { params, handlerFunc }
   */
  searchRoute(method, pathName) {
    const matchedRouteByMethod = this.routes[method];

    // TODO: Error Handling 추가 필요!
    if (!matchedRouteByMethod) {
      throw new Error('Route를 찾지 못했습니다!');
    }

    // HTTP Request Method and Path are matched
    if (matchedRouteByMethod.has(pathName)) {
      return {
        params: {},
        handlerFunc: matchedRouteByMethod.get(pathName),
      };
    }

    // Match the dynamic route - path-variable (ex. /users/:id)
    return this.matchDynamicRoute(matchedRouteByMethod, pathName);
  }

  /**
   * Match with dynamic route
   * @param {Map} routeMap
   * @param {string} requestPathName
   * @example /users/:id
   * @returns {Object | null} { params, handlerFunc }
   */
  matchDynamicRoute(routeMap, requestPathName) {
    const requestPathSegmentList = getPathSegmentList(requestPathName);

    for (const [routePathName, handlerFunc] of routeMap) {
      const routePathSegmentList = getPathSegmentList(routePathName);

      const params = {};
      let isNotMatched = false;

      /**
       * - 세그먼트 개수가 다른 경우 매칭 불가
       * - TODO: Question-Mark를 활용해서 Optional 기능 추가?
       */
      if (requestPathSegmentList.length !== routePathSegmentList.length) {
        isNotMatched = true;
        continue;
      }

      for (let i = 0; i < routePathSegmentList.length; i++) {
        const routePathSegment = routePathSegmentList[i];
        const requestPathSegment = requestPathSegmentList[i];

        if (routePathSegment.startsWith(':')) {
            const paramName = routePathSegment.slice(1);
            params[paramName] = requestPathSegment;   // Register the path-variable into the params object
        }
        else if (routePathSegment !== requestPathSegment) {
            isNotMatched = true;
            break;
        }
      }

      // If matched, return the handler function and params
      if (!isNotMatched) {
        return {
            params,
            handlerFunc
        }
      }
    }

    return null;
  }
}

export default Router;
