'use strict';

import { SIZE_UNITS } from './unit.constant.js';

// Request-body size limit (1MB)
export const HTTP_REQUEST_BODY_MAX_SIZE = 1 * SIZE_UNITS.MB;

// Request-body timeout (30 seconds)
export const HTT_REQUEST_TIMEOUT_LIMIT = 30000;

// Multipart Form-data size limit (50MB)
export const HTTP_MULTIPART_BODY_MAX_SIZE = 50 * SIZE_UNITS.MB;
