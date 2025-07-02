'use strict';

import url from 'url';
import BodyParser from '../body-parser/index.js';
import { getPathSegmentList } from '../../utils/router.util.js';
import { HTTP_METHODS } from '../../utils/constants/http.constant.js';
import { MethodNotAllowedException, RouteNotFoundException } from '../../exceptions/app.exception.js';

class Router {
    constructor({ prefix } = {}) {
        this.routes = {
            GET: new Map(),
            POST: new Map(),
            PUT: new Map(),
            DELETE: new Map(),
            PATCH: new Map()
        };

        // 지연 등록을 위한 임시 라우트 저장소
        this.pendingRoutes = {
            GET: [],
            POST: [],
            PUT: [],
            DELETE: [],
            PATCH: []
        };

        this.bodyParser = new BodyParser();
        this.globalPrefixPath = '';
        this.prefix = prefix;
    }

    /**
     * ======================================
     * ===== REGISTER THE HTTP METHOD =======
     * ======================================
     */
    get(path, handler) {
        this.pendingRoutes.GET.push({ path: this.getCombinedWithPrefix(path), handler });
        return this;
    }
    post(path, handler) {
        this.pendingRoutes.POST.push({ path: this.getCombinedWithPrefix(path), handler });
        return this;
    }
    put(path, handler) {
        this.pendingRoutes.PUT.push({ path: this.getCombinedWithPrefix(path), handler });
        return this;
    }
    delete(path, handler) {
        this.pendingRoutes.DELETE.push({ path: this.getCombinedWithPrefix(path), handler });
        return this;
    }
    patch(path, handler) {
        this.pendingRoutes.PATCH.push({ path: this.getCombinedWithPrefix(path), handler });
        return this;
    }

    /**
     * ======================================
     * ====== REGISTER THE ROUTER ===========
     * ======================================
     */
    use(router) {
        Object.keys(router.pendingRoutes).forEach((method) => {
            const pendingRoutesForMethod = router.pendingRoutes[method];

            pendingRoutesForMethod.forEach(({ path, handler }) => {
                const fullPath = this.globalPrefixPath + path;
                this.routes[method].set(fullPath, handler);
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
        const { method } = req;

        const parsedUrl = url.parse(req.url, true);
        const pathName = parsedUrl.pathname;

        req.query = parsedUrl.query;
        req.params = {};

        const searchRouteResult = this.searchRoute(method, pathName);
        console.log(searchRouteResult);

        if (searchRouteResult) {
            const { params, handlerFunc } = searchRouteResult;
            req.params = params;

            // Parse the request-body for HTTP POST, PUT, PATCH methods
            if ([HTTP_METHODS.POST, HTTP_METHODS.PUT, HTTP_METHODS.PATCH].includes(method)) {
                const { rawBody, parsedBody } = await this.bodyParser.parseRequestBody(req);

                req.body = parsedBody;
                req.rawBody = rawBody;
            } else {
                req.body = {};
                req.rawBody = '';
            }

            // Execute the handler function
            await handlerFunc(req, res);
        }
    }

    /**
     * ======================================
     * ======== MATCH WITH ROUTER ===========
     * ======================================
     */
    searchRoute(method, pathName) {
        const matchedRouteByMethod = this.routes[method];

        if (!matchedRouteByMethod) {
            throw new MethodNotAllowedException();
        }

        // Path-Variable 없이 매칭이 된 경우
        if (matchedRouteByMethod.has(pathName)) {
            return {
                params: {},
                handlerFunc: matchedRouteByMethod.get(pathName)
            };
        }

        return this.matchWithDynamicRoute(matchedRouteByMethod, pathName);
    }

    matchWithDynamicRoute(targetRouteMap, requestPathName) {
        for (const [routePathName, handlerFunc] of targetRouteMap) {
            const matchResult = this.executeMatchRoute(routePathName, getPathSegmentList(requestPathName));
            console.log('여기?');
            console.log(matchResult);

            if (matchResult) {
                return {
                    params: matchResult,
                    handlerFunc
                };
            }
        }

        return null;
    }

    executeMatchRoute(routePathName, requestPathSegmentList) {
        const routePathSegmentList = getPathSegmentList(routePathName);

        if (!this.isSegmentCountEqual(routePathSegmentList, requestPathSegmentList)) {
            throw new RouteNotFoundException();
        }

        return this.matchEachSegment(routePathSegmentList, requestPathSegmentList);
    }

    isSegmentCountEqual(routeSegmentList, requestSegmentList) {
        return requestSegmentList.length === routeSegmentList.length;
    }

    matchEachSegment(routeSegmentList, requestSegmentList) {
        const result = {};

        for (let i = 0; i < routeSegmentList.length; i++) {
            const routeSegment = routeSegmentList[i];
            const requestSegment = requestSegmentList[i];

            if (this.isPathVariableSegment(routeSegment)) {
                params[routeSegment.slice(1)] = requestSegment;
            } else {
                if (routeSegment !== requestSegment) {
                    throw new RouteNotFoundException();
                }
            }
        }

        return result;
    }

    isPathVariableSegment(segment) {
        return segment.startsWith(':');
    }

    isValidPrefix(prefix) {
        // 빈 문자열이거나 null/undefined인 경우 유효하지 않음
        // 공백만 있는 경우 유효하지 않음
        if (!prefix || prefix.trim() === '' || prefix.trim() !== prefix) {
            return false;
        }

        // 연속된 슬래시가 있는 경우 유효하지 않음 (ex. //users, users//api)
        if (prefix.includes('//')) {
            return false;
        }

        // 특수 문자나 유효하지 않은 URL 문자가 있는 경우
        const validUrlPattern = /^[a-zA-Z0-9\-_\/]+$/;
        if (!validUrlPattern.test(prefix)) {
            return false;
        }

        // (1) 앞에 /를 안붙인 경우 + 뒤에 /를 안붙인 경우 (ex. users) ✅
        // (2) 앞에 /를 안붙인 경우 + 뒤에 /를 붙인 경우 (ex. users/) ✅
        // (3) 앞에 /를 붙인 경우 + 뒤에 /를 안붙인 경우 (ex. /users) ✅
        // (4) 앞에 /를 붙이고 뒤에 /를 붙인 경우 (ex. /users/) ✅
        // (5) 이 외의 경우는 위의 검증을 통과한 경우만 유효

        return true;
    }

    setGlobalPrefixPath(globalPrefixPath) {
        this.globalPrefixPath = globalPrefixPath;
        return this;
    }

    getCombinedWithPrefix(path) {
        if (!this.isValidPrefix(this.prefix)) {
            return path;
        }

        // prefix를 정규화 (앞뒤 슬래시 처리)
        let normalizedPrefix = this.prefix;

        // prefix가 /로 시작하지 않으면 추가
        if (!normalizedPrefix.startsWith('/')) {
            normalizedPrefix = '/' + normalizedPrefix;
        }

        // prefix가 /로 끝나면 제거 (path와 결합할 때 중복 방지)
        if (normalizedPrefix.endsWith('/') && normalizedPrefix !== '/') {
            normalizedPrefix = normalizedPrefix.slice(0, -1);
        }

        // path 정규화
        let normalizedPath = path;
        if (!normalizedPath.startsWith('/')) {
            normalizedPath = '/' + normalizedPath;
        }

        // 최종 결합
        return normalizedPrefix + normalizedPath;
    }

    getCombinedPath(path) {
        return `${this.globalPrefixPath}${path}`;
    }
}

export default Router;
