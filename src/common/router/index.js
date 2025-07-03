'use strict';

import url from 'url';
import BodyParser from '../body-parser/index.js';
import REGEX from '../../utils/regex/index.js';
import { getPathSegmentList } from '../../utils/router.util.js';
import { HTTP_METHODS } from '../../utils/constants/http.constant.js';
import {
    InternalServerErrorException,
    MethodNotAllowedException,
    RouteNotFoundException
} from '../../exceptions/AppException.js';
import { ERROR_MESSAGE } from '../../exceptions/ErrorMessage.js';

class Router {
    constructor({ prefix = '' } = {}) {
        this.routes = {
            GET: new Map(),
            POST: new Map(),
            PUT: new Map(),
            DELETE: new Map(),
            PATCH: new Map()
        };

        this.bodyParser = new BodyParser();

        this.globalPrefixPath = '';
        this.prefix = this.normalizeRouterPrefix(prefix);
    }

    /**
     * ======================================
     * ===== REGISTER THE HTTP METHOD =======
     * ======================================
     */
    get(path, handler) {
        const fullCombinedRouterPath = this.getCombinedWithRouterPrefix(path);

        this.checkDuplicateRoute(HTTP_METHODS.GET, fullCombinedRouterPath);
        this.routes.GET.set(fullCombinedRouterPath, handler);

        return this;
    }
    post(path, handler) {
        const fullCombinedRouterPath = this.getCombinedWithRouterPrefix(path);

        this.checkDuplicateRoute(HTTP_METHODS.POST, fullCombinedRouterPath);
        this.routes.POST.set(fullCombinedRouterPath, handler);

        return this;
    }
    put(path, handler) {
        const fullCombinedRouterPath = this.getCombinedWithRouterPrefix(path);

        this.checkDuplicateRoute(HTTP_METHODS.PUT, fullCombinedRouterPath);
        this.routes.PUT.set(fullCombinedRouterPath, handler);

        return this;
    }
    patch(path, handler) {
        const fullCombinedRouterPath = this.getCombinedWithRouterPrefix(path);

        this.checkDuplicateRoute(HTTP_METHODS.PATCH, fullCombinedRouterPath);
        this.routes.PATCH.set(fullCombinedRouterPath, handler);

        return this;
    }
    delete(path, handler) {
        const fullCombinedRouterPath = this.getCombinedWithRouterPrefix(path);

        this.checkDuplicateRoute(HTTP_METHODS.DELETE, fullCombinedRouterPath);
        this.routes.DELETE.set(fullCombinedRouterPath, handler);

        return this;
    }

    /**
     * ======================================
     * ====== REGISTER THE ROUTER ===========
     * ======================================
     */
    use(router) {
        Object.keys(router.routes).forEach((method) => {
            const routesForMethod = router.routes[method];

            routesForMethod.forEach((handler, path) => {
                const fullCombinedRouterPath = this.getFullCombinedPath(path);
                this.checkDuplicateRoute(method, fullCombinedRouterPath);
                this.routes[method].set(fullCombinedRouterPath, handler);
            });
        });

        return this;
    }

    /**
     * ======================================
     * ======= HANDLE THE REQUEST ===========
     * ======================================
     */
    async handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);

        req.query = parsedUrl.query;
        req.params = {};

        const searchRouteResult = this.searchRoute(req.method, parsedUrl.pathname);

        if (!searchRouteResult.isMatched) {
            throw new RouteNotFoundException();
        }

        req.params = searchRouteResult.params;
        req.body = {};
        req.rawBody = '';

        if (this.isRequestBodyRequiredMethod(req.method)) {
            const { rawBody, parsedBody } = await this.bodyParser.parseRequestBody(req);
            req.body = parsedBody;
            req.rawBody = rawBody;
        }

        await searchRouteResult.handlerFunc(req, res);
    }

    isRequestBodyRequiredMethod(method) {
        return [HTTP_METHODS.POST, HTTP_METHODS.PUT, HTTP_METHODS.PATCH].includes(method);
    }

    /**
     * ======================================
     * ======== MATCH WITH ROUTER ===========
     * ======================================
     */
    isSegmentCountEqual(routeSegmentList, requestSegmentList) {
        return requestSegmentList.length === routeSegmentList.length;
    }

    isPathVariableSegment(segment) {
        return segment.startsWith(':');
    }

    generateSearchRouteResult(isMatched, args = { params: {}, handlerFunc: null }) {
        return {
            isMatched,
            params: args.params,
            handlerFunc: args.handlerFunc
        };
    }

    searchRoute(method, pathName) {
        const matchedRouteByMethod = this.routes[method];

        if (!matchedRouteByMethod) {
            throw new MethodNotAllowedException();
        }

        // Path-Variable 없이 매칭이 된 경우
        if (matchedRouteByMethod.has(pathName)) {
            return this.generateSearchRouteResult(true, {
                handlerFunc: matchedRouteByMethod.get(pathName)
            });
        }

        return this.matchWithDynamicRoute(matchedRouteByMethod, pathName);
    }

    matchWithDynamicRoute(targetRouteMap, requestPathName) {
        for (const [routePathName, handlerFunc] of targetRouteMap) {
            const result = this.executeMatchRoute(routePathName, getPathSegmentList(requestPathName));

            if (!result.isMatched) {
                continue;
            }

            return this.generateSearchRouteResult(true, { params: result.params, handlerFunc });
        }

        return this.generateSearchRouteResult(false);
    }

    executeMatchRoute(routePathName, requestPathSegmentList) {
        const routePathSegmentList = getPathSegmentList(routePathName);

        if (!this.isSegmentCountEqual(routePathSegmentList, requestPathSegmentList)) {
            return this.generateSearchRouteResult(false);
        }

        return this.matchEachSegment(routePathSegmentList, requestPathSegmentList);
    }

    matchEachSegment(routeSegmentList, requestSegmentList) {
        const params = {};

        for (let i = 0; i < routeSegmentList.length; i++) {
            const routeSegment = routeSegmentList[i];
            const requestSegment = requestSegmentList[i];

            if (this.isPathVariableSegment(routeSegment)) {
                params[routeSegment.slice(1)] = requestSegment;
            } else {
                if (routeSegment !== requestSegment) {
                    return this.generateSearchRouteResult(false);
                }
            }
        }

        return this.generateSearchRouteResult(true, { params });
    }

    /**
     * ======================================
     * ====== DUPLICATE ROUTE CHECK =========
     * ======================================
     */
    checkDuplicateRoute(method, path) {
        if (this.routes[method].has(path)) {
            throw new InternalServerErrorException({
                responseCode: ERROR_MESSAGE.DUPLICATE_ROUTE.responseCode,
                message: `${ERROR_MESSAGE.DUPLICATE_ROUTE.message} [${method} ${path}]`
            });
        }
    }

    /**
     * ======================================
     * ======== SET ROUTER PREFIX ===========
     * ======================================
     */
    setGlobalPrefixPath(globalPrefixPath) {
        if (!this.isValidPrefix(globalPrefixPath)) {
            throw new InternalServerErrorException(ERROR_MESSAGE.INVALID_PREFIX);
        }
        this.globalPrefixPath = this.normalizeRouterPrefix(globalPrefixPath);
        return this;
    }

    isValidPrefix(prefix) {
        if (
            prefix.trim() !== prefix ||
            prefix.includes('//') ||
            (prefix !== '' && !REGEX.ROUTER_PREFIX.test(prefix))
        ) {
            return false;
        }

        return true;
    }

    normalizeRouterPrefix(prefix) {
        if (!this.isValidPrefix(prefix)) {
            throw new InternalServerErrorException(ERROR_MESSAGE.INVALID_PREFIX);
        }

        if (prefix === '' || prefix === '/') {
            return '';
        }

        let normalizedPrefix = prefix;

        if (!normalizedPrefix.startsWith('/')) {
            normalizedPrefix = '/' + normalizedPrefix;
        }

        if (normalizedPrefix.endsWith('/') && normalizedPrefix !== '/') {
            normalizedPrefix = normalizedPrefix.slice(0, -1);
        }

        return normalizedPrefix;
    }

    getCombinedWithRouterPrefix(path) {
        if (path === '/') {
            return this.prefix;
        }

        return this.prefix + path;
    }

    getFullCombinedPath(path) {
        return this.globalPrefixPath + path;
    }
}

export default Router;
