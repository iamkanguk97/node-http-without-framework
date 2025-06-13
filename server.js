import { runApplicationServer } from './src/app.js';
import { appConfig } from './src/configs/app.config.js';
import DataInitializationUtil from './src/utils/data-initialize/data-initialize.util.js';

async function bootstrap() {
    try {
        // 데이터 초기화 실행
        // const dataInitService = new DataInitializationService();
        const dataInitUtil = new DataInitializationUtil();
        await dataInitUtil.initialize();

        // 서버 시작
        const { APP_PORT } = appConfig;
        await runApplicationServer(APP_PORT);

        console.log('✅ Server started successfully! ✅');
    } catch (error) {
        console.log('❌ An error occurred while starting the server! ❌');
        console.error(error);
        process.exit(1);
    }
}

bootstrap();
