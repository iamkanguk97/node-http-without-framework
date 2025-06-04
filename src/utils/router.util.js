'use strict';

/**
 * Get the path segment list from the path
 * @param {string} path
 * @returns {string[]}
 */
export const getPathSegmentList = path => {
    return path.split('/').filter(segment => segment !== '');
};

/**
 * Get the full content type from the request
 * @param {Object} req
 * @returns {string}
 */
export const getFullContentType = req => {
    return req.headers['content-type'] || '';
};

/**
 * Get the base content type from the raw content type
 * (e.g. application/json; charset=utf-8 -> application/json)
 *
 * @param {string} rawContentType
 * @returns {string}
 */
export const getBaseContentType = rawContentType => {
    return rawContentType.split(';')[0].trim().toLowerCase();
};

/**
 * Get the content type from the request (base type only)
 * @param {Object} req
 * @returns {string}
 */
export const getContentType = req => {
    const contentType = req.headers['content-type'];

    if (!contentType) {
        return '';
    }

    return getBaseContentType(contentType);
};
