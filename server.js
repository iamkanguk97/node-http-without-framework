'use strict';

import { runApplicationServer } from './src/app.js';
import { appConfig } from './src/configs/app.config.js';
import DataInitializationUtil from './src/utils/data-initialize/data-initialize.util.js';

async function bootstrap() {
    try {
        const dataInitUtil = new DataInitializationUtil();
        await dataInitUtil.initialize();
        
        const { APP_PORT } = appConfig;
        await runApplicationServer(APP_PORT);

        console.log('✅ Server started successfully! ✅');
    } catch (error) {
        console.log('❌ An error occurred while starting the server! ❌');
        console.error(error);
        process.exit(1);
    }
}

await bootstrap();
