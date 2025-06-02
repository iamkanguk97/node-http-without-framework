import dotenv from 'dotenv';

dotenv.config();

const appConfig = {
    APP_PORT: process.env.APP_PORT || 8000
};

export default appConfig;
