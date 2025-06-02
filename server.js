import { runApplicationServer } from './src/app.js';
import { appConfig } from './src/configs/app.config.js';

function bootstrap() {
    const { APP_PORT } = appConfig;

    runApplicationServer(APP_PORT)
        .then(() => {
            console.log('✅ Server started successfully! ✅');
        })
        .catch(error => {
            console.log('❌ An error occurred while starting the server! ❌');
            console.error(error);
            process.exit(1);
        });
}

bootstrap();
