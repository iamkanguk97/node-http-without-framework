import { getPathWithLayers } from '../file.util.js';

class DataInitializationUtil {
    /**
     * data 디렉토리 생성
     * domains 디렉토리 스키마 파일 스캔
     * 각 스키마에 대응하는 데이터 파일 생성 (없는 경우)
     */
    async initialize() {
        console.log('🚀 Starting data initialization...');

        const dataPath = getPathWithLayers('data');
        console.log(dataPath);
    }
}

export default DataInitializationUtil;
