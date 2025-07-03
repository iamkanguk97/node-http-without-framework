'use strict';

import { getContentType, getFullContentType, getBaseContentType } from '../../utils/router.util.js';
import { HTTP_CONTENT_TYPES, SUPPORTED_CONTENT_TYPES } from '../../utils/constants/content-type.constant.js';
import {
    HTTP_REQUEST_BODY_MAX_SIZE,
    HTT_REQUEST_TIMEOUT_LIMIT,
    HTTP_MULTIPART_BODY_MAX_SIZE
} from '../../utils/constants/body-parser.constant.js';

class BodyParser {
    constructor() {
        this.options = {
            // Request-body size limit
            maxSize: HTTP_REQUEST_BODY_MAX_SIZE,
            // Multipart Form-data size limit
            multipartMaxSize: HTTP_MULTIPART_BODY_MAX_SIZE,
            // Request-body timeout
            timeout: HTT_REQUEST_TIMEOUT_LIMIT,
            // Supported content type list
            supportedContentTypeList: SUPPORTED_CONTENT_TYPES
        };
    }

    async getRequestBody(req) {
        return new Promise((resolve, reject) => {
            let body = '';
            let size = 0;

            const contentType = getContentType(req);
            const limitSize =
                contentType === HTTP_CONTENT_TYPES.MULTIPART_FORM_DATA
                    ? this.options.multipartMaxSize
                    : this.options.maxSize;

            // Set the timeout for the request-body
            const timeout = setTimeout(() => {
                reject(new Error('Request timeout'));
            }, this.options.timeout);

            // Request-body stream data transfer event listener
            req.on('data', (chunk) => {
                size += chunk.length;

                // Check the request-body size exceeds the maximum limit
                if (size > limitSize) {
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
     * Extract boundary from multipart content type
     * @param {string} rawContentType
     * @returns {string|null}
     */
    extractBoundary(rawContentType) {
        const boundaryMatch = rawContentType.match(/boundary=([^;]+)/);
        return boundaryMatch ? boundaryMatch[1].replace(/"/g, '') : null;
    }

    /**
     * Parse the request body from raw body and content type
     * @param {string} rawBody
     * @param {string} rawContentType
     * @returns {Object}
     */
    parseRequestBodyWithContentType(rawBody, rawContentType) {
        if (!rawBody || rawBody.trim().length === 0) {
            return {};
        }

        const contentType = getBaseContentType(rawContentType);

        /**
         * Check the content-type is supported or not
         * TODO: 지원하지 않으면? 에러 발생 -> 에러코드? OR 에러메세지?
         */
        if (!this.options.supportedContentTypeList.includes(contentType)) {
            throw new Error(`Unsupported content type: ${contentType}`);
        }

        switch (contentType) {
            case HTTP_CONTENT_TYPES.APPLICATION_JSON:
                return this.parseJsonBody(rawBody);
            case HTTP_CONTENT_TYPES.APPLICATION_FORM_URLENCODED:
                return this.parseUrlEncodedBody(rawBody);
            case HTTP_CONTENT_TYPES.TEXT_HTML:
            case HTTP_CONTENT_TYPES.TEXT_PLAIN:
                return this.parseTextBody(rawBody);
            case HTTP_CONTENT_TYPES.MULTIPART_FORM_DATA:
                const boundary = this.extractBoundary(rawContentType);
                return this.parseMultipartFormData(rawBody, boundary);
            default:
                throw new Error(`Unsupported content type: ${contentType}`);
        }
    }

    async parseRequestBody(req) {
        try {
            const rawRequestBody = await this.getRequestBody(req);
            const rawContentType = getFullContentType(req);

            return {
                rawBody: rawRequestBody,
                parsedBody: this.parseRequestBodyWithContentType(rawRequestBody, rawContentType)
            };
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
     * @example name=%EC%9D%B4%EA%B0%95%EC%9A%B1&age=30
     */
    parseUrlEncodedBody(rawBody) {
        try {
            const bodySegmentList = rawBody.split('&');
            const result = {};

            for (const segment of bodySegmentList) {
                const [key, value] = segment.split('=');

                if (key) {
                    const decodedKey = decodeURIComponent(key);
                    const decodedValue = value ? decodeURIComponent(value) : '';

                    // Array form handling (e.g. name[]=value1&name[]=value2)
                    if (decodedKey.endsWith('[]')) {
                        const arrayKey = decodedKey.slice(0, -2);
                        if (!result[arrayKey]) {
                            result[arrayKey] = [];
                        }
                        result[arrayKey].push(decodedValue);
                    }
                    // Duplicate key handling (e.g. name=value1&name=value2)
                    else if (result[decodedKey]) {
                        if (Array.isArray(result[decodedKey])) {
                            result[decodedKey].push(decodedValue);
                        } else {
                            result[decodedKey] = [result[decodedKey], decodedValue];
                        }
                    }
                    // Normal key-value pair handling (e.g. name=value)
                    else {
                        result[decodedKey] = decodedValue;
                    }
                }
            }

            return result;
        } catch (error) {
            console.error(error);
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
    parseMultipartFormData(rawBody, boundary) {
        try {
            const result = {};
            const files = {};

            if (!(rawBody && boundary)) {
                return { fields: result, files };
            }

            // boundary로 데이터 분할
            const parts = rawBody.split(`--${boundary}`);

            for (const part of parts) {
                // 빈 부분이나 종료 부분 건너뛰기
                if (!part.trim() || part.trim() === '--') {
                    continue;
                }

                const parsed = this.parseMultipartPart(part);

                if (parsed) {
                    if (parsed.isFile) {
                        files[parsed.name] = parsed;
                    } else {
                        // 배열 형태 처리
                        if (result[parsed.name]) {
                            if (Array.isArray(result[parsed.name])) {
                                result[parsed.name].push(parsed.value);
                            } else {
                                result[parsed.name] = [result[parsed.name], parsed.value];
                            }
                        } else {
                            result[parsed.name] = parsed.value;
                        }
                    }
                }
            }

            return { fields: result, files };
        } catch (error) {
            throw new Error(`Invalid multipart form data: ${error.message}`);
        }
    }

    /**
     * Parse individual multipart part
     * @param {string} part - Individual part of multipart data
     * @returns {Object|null}
     */
    parseMultipartPart(part) {
        try {
            // 헤더와 본문 분리
            const [headerSection, ...bodyParts] = part.split('\r\n\r\n');
            const body = bodyParts.join('\r\n\r\n').replace(/\r\n$/, '');

            // console.log(headerSection, bodyParts);
            // console.log(body);

            if (!headerSection || body === undefined) {
                return null;
            }

            // Content-Disposition 헤더 파싱
            const headers = this.parseMultipartHeaders(headerSection);
            const contentDisposition = headers['content-disposition'];

            console.log(headers);
            console.log(contentDisposition);

            if (!contentDisposition) {
                return null;
            }

            // name 속성 추출
            const nameMatch = contentDisposition.match(/name="([^"]+)"/);
            if (!nameMatch) {
                return null;
            }

            const name = nameMatch[1];

            // 파일인지 확인
            const filenameMatch = contentDisposition.match(/filename="([^"]*)"/);
            const isFile = !!filenameMatch;

            if (isFile) {
                return {
                    name,
                    isFile: true,
                    filename: filenameMatch[1],
                    contentType: headers['content-type'] || 'application/octet-stream',
                    data: body,
                    size: Buffer.byteLength(body, 'utf8')
                };
            } else {
                return {
                    name,
                    isFile: false,
                    value: body
                };
            }
        } catch (error) {
            console.error('Error parsing multipart part:', error);
            return null;
        }
    }

    /**
     * Parse multipart headers
     * @param {string} headerSection
     * @returns {Object}
     */
    parseMultipartHeaders(headerSection) {
        const headers = {};
        const lines = headerSection.split('\r\n');

        for (const line of lines) {
            if (line.trim()) {
                const [key, ...valueParts] = line.split(':');
                if (key && valueParts.length > 0) {
                    headers[key.trim().toLowerCase()] = valueParts.join(':').trim();
                }
            }
        }

        return headers;
    }
}

export default BodyParser;
