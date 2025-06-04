import { ensureDirectoryExists, fileExists, createJsonFile, getJsFiles } from '../utils/file.util.js';
import { getDataDirectoryPath, getDomainsDirectoryPath, getDataFilePath } from '../utils/schema.util.js';

/**
 * 데이터 초기화 서비스
 * 서버 시작 시 스키마를 기반으로 데이터 파일들을 자동 생성합니다.
 */
class DataInitializationService {
    /**
     * 데이터 초기화를 실행합니다.
     * 1. data 디렉토리 생성 (없는 경우)
     * 2. domains 디렉토리의 스키마 파일들 스캔
     * 3. 각 스키마에 대응하는 데이터 파일 생성 (없는 경우)
     */
    async initialize() {
        try {
            console.log('🚀 Starting data initialization...');

            // 1. data 디렉토리 생성
            this._ensureDataDirectory();

            // 2. 스키마 파일들 스캔 및 데이터 파일 생성
            await this._initializeDataFiles();

            console.log('✅ Data initialization completed successfully!');
        } catch (error) {
            console.error('❌ Error during data initialization:', error);
            throw error;
        }
    }

    /**
     * data 디렉토리가 존재하는지 확인하고 없으면 생성합니다.
     * @private
     */
    _ensureDataDirectory() {
        const dataDir = getDataDirectoryPath();
        ensureDirectoryExists(dataDir);
    }

    /**
     * 스키마 파일들을 스캔하고 대응하는 데이터 파일들을 생성합니다.
     * @private
     */
    async _initializeDataFiles() {
        const domainsDir = getDomainsDirectoryPath();
        const schemaFiles = getJsFiles(domainsDir);

        if (schemaFiles.length === 0) {
            console.log('📝 No schema files found in domains directory');
            return;
        }

        console.log(`📋 Found ${schemaFiles.length} schema file(s): ${schemaFiles.join(', ')}`);

        for (const schemaName of schemaFiles) {
            await this._createDataFileIfNotExists(schemaName);
        }
    }

    /**
     * 특정 스키마에 대응하는 데이터 파일이 없으면 생성합니다.
     * @param {string} schemaName - 스키마 이름
     * @private
     */
    async _createDataFileIfNotExists(schemaName) {
        const dataFilePath = getDataFilePath(schemaName);

        if (!fileExists(dataFilePath)) {
            // 빈 배열로 초기화된 JSON 파일 생성
            createJsonFile(dataFilePath, []);
            console.log(`✨ Initialized data file for ${schemaName} schema`);
        } else {
            console.log(`📄 Data file for ${schemaName} already exists`);
        }
    }
}

export default DataInitializationService;
