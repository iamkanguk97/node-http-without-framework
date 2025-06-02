import { runApplicationServer } from './src/app.js';
import appConfig from './src/configs/app.config.js';

function bootstrap() {
    const { APP_PORT } = appConfig;
    runApplicationServer(APP_PORT);
}

bootstrap();
