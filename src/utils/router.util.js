/**
 * Get the path segment list from the path
 * @param {string} path
 * @returns {string[]}
 */
export const getPathSegmentList = (path) => {
  return path.split('/').filter(segment => segment !== '');
}

/**
 * Get the content type from the request
 * @param {Object} req
 * @returns {string}
 */
export const getContentType = (req) => {
  return req.headers['content-type'] || '';
}