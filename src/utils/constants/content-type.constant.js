'use strict';

// HTTP Content-Types
export const HTTP_CONTENT_TYPES = Object.freeze({
    // JSON 관련
    APPLICATION_JSON: 'application/json',

    // Form 관련
    APPLICATION_FORM_URLENCODED: 'application/x-www-form-urlencoded',
    MULTIPART_FORM_DATA: 'multipart/form-data',

    // Text 관련
    TEXT_PLAIN: 'text/plain',
    TEXT_HTML: 'text/html'
});

// Supported Content-Types
export const SUPPORTED_CONTENT_TYPES = Object.freeze([
    HTTP_CONTENT_TYPES.APPLICATION_JSON,
    HTTP_CONTENT_TYPES.APPLICATION_FORM_URLENCODED,
    HTTP_CONTENT_TYPES.TEXT_PLAIN,
    HTTP_CONTENT_TYPES.TEXT_HTML,
    HTTP_CONTENT_TYPES.MULTIPART_FORM_DATA
]);
