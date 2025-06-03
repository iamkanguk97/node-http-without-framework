import { getContentType } from '../../utils/router.util.js';

class BodyParser {
  constructor() {
    this.options = {
      // Request-body size limit (1MB)
      maxSize: 1024 * 1024,
      // Request-body timeout
      timeout: 30000,
      // Supported content type list
      supportedContentTypeList: [
        'application/json',
        'application/x-www-form-urlencoded',
        'text/plain',
        'text/html',
        'multipart/form-data'
      ],
    };
  }

  /**
   * Get the request body from HTTP request stream
   * @param {http.IncomingMessage} req 
   * @returns {Promise<string>}
   */
  getRequestBody(req) {
    return new Promise((resolve, reject) => {
      let body = '';
      let size = 0;

      // Set the timeout for the request-body
      const timeout = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, this.options.timeout);

      // Request-body stream data transfer event listener
      req.on('data', (chunk) => {
        size += chunk.length;

        // Check the request-body size exceeds the maximum limit
        if (size > this.options.maxSize) {
          clearTimeout(timeout);
          reject(new Error('Request body size exceeds the maximum limit'));
        }

        body += chunk.toString();
      });

      // Request-body stream transfer end event listener
      req.on('end', () => {
        clearTimeout(timeout);
        resolve(body);
      });

      // Request-body stream transfer error event listener
      req.on('error', (error) => {
        clearTimeout(timeout);
        reject(new Error(error.message));
      });
    });
  }

  /**
   * Parse the request body from raw body and content type
   * @param {string} rawBody 
   * @param {string} contentType 
   * @returns {Object}
   */
  parseRequestBody(rawBody, contentType) {
    if (!rawBody) {
      return {};
    }

    switch (contentType) {
      case 'application/json':
          return this.parseJsonBody(rawBody);
      case 'application/x-www-form-urlencoded':
          return this.parseUrlEncodedBody(rawBody);
      case 'text/html':
      case 'text/plain':
          return this.parseTextBody(rawBody);
      case 'multipart/form-data':
          return this.parseMultipartFormData(rawBody);
      default:
          return this.parseTextBody(rawBody);
    }
  }

  /**
   * Parse the request body from the request
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   */
  async parse(req, res) {
    try {
      const rawRequestBody = await this.getRequestBody(req);
      const contentType = getContentType(req);

      req.body = this.parseRequestBody(rawRequestBody, contentType);
      req.rawBody = rawRequestBody;
    } catch (error) {
      console.error(error);
      throw error;
    } 
  }

  /**
   * Parse the raw request-body as JSON
   * @param {string} rawBody
   * @returns {Object}
   */
  parseJsonBody(rawBody) {
    try {
      return JSON.parse(rawBody);
    } catch (error) {
      throw new Error('Invalid JSON body');
    }
  }

  /**
   * Parse the raw request-body as URL encoded
   * @param {string} rawBody
   * @returns {Object}
   */
  parseUrlEncodedBody(rawBody) {
    try {
      const params = new URLSearchParams(rawBody);
      const result = {};

      return rawBody;
    } catch (error) {
      throw new Error('Invalid URL encoded body');
    }
  }

  /**
   * Parse the raw request-body as text
   * @param {string} rawBody
   * @returns {string}
   */
  parseTextBody(rawBody) {
    return rawBody;
  }

  // TODO
  parseMultipartFormData(rawBody) {
    return rawBody;
  }
}

export default BodyParser;