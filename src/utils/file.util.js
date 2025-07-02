'use strict';

import { promises as fs } from 'fs';
import path from 'path';

export function getPathWithLayers(...args) {
    return path.resolve(process.cwd(), ...args);
}

export async function createDir(path) {
    if (await isFileOrDirExist(path)) {
        return;
    }

    await fs.mkdir(path, { recursive: true });
}

export async function isFileOrDirExist(path) {
    return fs
        .access(path, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);
}

/**
 * Read file with fs
 * @param {string} path - Path to read
 * @returns {Promise<string>} File content
 */
export async function readFileWithFs(path) {
    return await fs.readFile(path, 'utf8');
}

/**
 * Write json file with fs
 * @param {string} path - Path to write
 * @param {any} data - Data to write
 * @returns {Promise<void>}
 */
export async function writeJsonFileWithFs(path, data) {
    await fs.writeFile(path, JSON.stringify(data));
}
