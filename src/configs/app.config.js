'use strict';

import dotenv from 'dotenv';

dotenv.config();

export const appConfig = Object.freeze({
    NODE_ENV: process.env.NODE_ENV ?? 'develop',
    APP_PORT: process.env.APP_PORT ?? 8000
});
