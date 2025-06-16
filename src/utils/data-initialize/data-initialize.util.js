'use strict';

import { createDir } from "../file.util.js";
import {
  createDatabaseFile,
  getDatabaseDirectoryPath,
  getSchemaFiles,
} from '../schema/schema.util.js';

class DataInitializationUtil {
    /**
     * Initialize the database status
     */
    async initialize() {
        try {
            console.log('🚀 Starting data initialization...');

            const databaseDirPath = getDatabaseDirectoryPath();
            await createDir(databaseDirPath);

            await this.syncApplicationWithSchemaFiles(databaseDirPath);

            console.log('✅ Data initialization completed successfully!');
        } catch (error) {
            console.error('❌ Error during data initialization:', error);
            throw error;
        }
    }

    /**
     * Match the sync with schema files
     */
    async syncApplicationWithSchemaFiles(databaseDirPath) {
        const schemaFilePathList = await getSchemaFiles();

        for (const schemaFilePath of schemaFilePathList) {
            await createDatabaseFile(databaseDirPath, schemaFilePath);
        }
    }
}

export default DataInitializationUtil;
