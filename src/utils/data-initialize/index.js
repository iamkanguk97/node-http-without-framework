'use strict';

import { createDir, getPathWithLayers, isFileOrDirExist } from '../file.util.js';
import {
    getDatabaseDirectoryPath,
    getSchemaFileNameList,
    getSchemaNameFromFileName,
    setDatabaseFileName
} from '../schema/schema.util.js';
import { promises as fs } from 'fs';

class DataInitializationFactory {
    async initialize() {
        try {
            console.log('🚀 Starting data initialization...');

            await createDir(getDatabaseDirectoryPath());
            await this.syncApplicationWithSchemaFiles();

            console.log('✅ Data initialization completed successfully!');
        } catch (error) {
            console.error('❌ Error during data initialization:', error);
            throw error;
        }
    }

    async syncApplicationWithSchemaFiles() {
        const schemaFileNameList = await getSchemaFileNameList();
        const syncSchemaFileTaskList = await this.getSyncSchemaFileTaskList(schemaFileNameList);
        await Promise.all(syncSchemaFileTaskList);
    }

    async getSyncSchemaFileTaskList(schemaFileNameList) {
        const result = [];

        for (const schemaFileName of schemaFileNameList) {
            const databaseFilePath = getPathWithLayers(
                getDatabaseDirectoryPath(),
                setDatabaseFileName(getSchemaNameFromFileName(schemaFileName))
            );

            if (await isFileOrDirExist(databaseFilePath)) {
                continue;
            }

            result.push(fs.writeFile(databaseFilePath, JSON.stringify(new Array()), 'utf8'));
        }

        return result;
    }
}

export default DataInitializationFactory;
