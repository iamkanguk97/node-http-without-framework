'use strict';

import { getPathWithLayers } from '../file.util.js';
import { promises as fs } from 'fs';

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
