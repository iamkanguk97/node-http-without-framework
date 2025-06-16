'use strict';

import dotenv from 'dotenv';

dotenv.config();

export const appConfig = Object.freeze({
    APP_PORT: process.env.APP_PORT || 8000,
});
