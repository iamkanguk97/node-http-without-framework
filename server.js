'use strict';

import { runApplicationServer } from './src/app.js';
import { appConfig } from './src/configs/app.config.js';
import DataInitializationFactory from './src/utils/data-initialize/index.js';

async function bootstrap() {
    try {
        await new DataInitializationFactory().initialize();
        await runApplicationServer(appConfig.APP_PORT);

        console.log('✅ Server started successfully! ✅');
    } catch (error) {
        console.log('❌ An error occurred while starting the server! ❌');
        console.error(error);
        process.exit(1);
    }
}

await bootstrap();
