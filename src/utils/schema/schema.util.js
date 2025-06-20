'use strict';

import path from 'path';
import { getPathWithLayers, isFileOrDirExist } from '../file.util.js';
import { promises as fs } from 'fs';
import { v7 } from 'uuid';

/**
 * Get the domain directory path
 * @returns {string} The absolute path of the domain directory
 */
export function getSchemaRootDirectoryPath() {
    return getPathWithLayers('src', 'domains');
}

/**
 * Get the data directory path
 * @returns {string} The absolute path of the data directory
 */
export function getDatabaseDirectoryPath() {
    return getPathWithLayers('data');
}

/**
 * Get schema files
 * @returns {Promise<string[]>} schema files
 */
export async function getSchemaFiles() {
    const domainRootDirPath = getSchemaRootDirectoryPath();

    try {
        return await fs.readdir(domainRootDirPath);
    } catch (error) {
        return [];
    }
}

/**
 * Get the schema name from path
 * @param {string} schemaFilePath
 * @returns {string}
 */
export function getSchemaNameFromPath(schemaFilePath) {
    return schemaFilePath.split('.')[0];
}

/**
 * Set the database file name with schema name
 * @param {string} schemaName
 * @returns {string}
 */
export function setDatabaseFileName(schemaName) {
    return `${schemaName}.json`;
}

/**
 * Create database file from schema file
 * @param {string} databaseDirPath
 * @param {string} schemaFilePath
 */
export async function createDatabaseFile(databaseDirPath, schemaFilePath) {
    const schemaName = getSchemaNameFromPath(schemaFilePath);
    const databaseFileName = setDatabaseFileName(schemaName);

    const databaseFilePath = path.join(databaseDirPath, databaseFileName);
    const isDatabaseFileExist = await isFileOrDirExist(databaseFilePath);

    if (!isDatabaseFileExist) {
        await fs.writeFile(databaseFilePath, '[]', 'utf8');
    }
}

/**
 * Generate uuid v7
 * @returns {string} uuid v7
 */
export function uuidv7() {
    return v7();
}
