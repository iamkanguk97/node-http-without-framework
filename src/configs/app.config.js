import dotenv from 'dotenv';

dotenv.config();

export const appConfig = {
    APP_PORT: process.env.APP_PORT || 8000
};
