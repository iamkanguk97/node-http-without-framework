'use strict';

import { getPathWithLayers } from '../file.util.js';
import { promises as fs } from 'fs';
import { v7 } from 'uuid';

export function getSchemaRootDirectoryPath() {
    return getPathWithLayers('src', 'entities');
}

export function getDatabaseDirectoryPath() {
    return getPathWithLayers('data');
}

export async function getSchemaFileNameList() {
    return fs.readdir(getSchemaRootDirectoryPath()).catch(() => []);
}

export function getSchemaNameFromFileName(schemaFileName) {
    return schemaFileName.split('.')[0];
}

export function setDatabaseFileName(schemaName) {
    return `${schemaName}.json`;
}

/**
 * Generate uuid v7
 * @returns {string} uuid v7
 */
export function uuidv7() {
    return v7();
}
