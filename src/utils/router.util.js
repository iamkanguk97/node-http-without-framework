/**
 * Get the path segment list from the path
 * @param {string} path
 * @returns {string[]}
 */
export const getPathSegmentList = (path) => {
  return path.split('/').filter(segment => segment !== '');
}