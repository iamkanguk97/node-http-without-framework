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
        'multipart/form-data'
      ]
    }
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
  parseRequestBody(rawBody, contentType) {}


  parse() {}
  parseJsonBody() {}
  parseUrlEncodedBody() {}
  parseTextBody() {}
  parseMultipartFormData() {}
}

export default BodyParser;