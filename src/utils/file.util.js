'use strict';

import { promises as fs } from 'fs';
import path from 'path';

/**
 * Create the file or directory if not exists.
 * @param {*} path
 */
export async function createDir(path) {
    const isExist = await isFileOrDirExist(path);
    if (!isExist) {
        await fs.mkdir(path, { recursive: true });
    }
}

/**
 * Check if file or directory exists
 * @param {string} path - Path to check
 * @returns {Promise<boolean>} True if file or directory exists, false otherwise
 */
export async function isFileOrDirExist(path) {
    try {
        await fs.access(path, fs.constants.F_OK);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Get path with layers
 * @param {...string} args - Path layers
 * @returns {string} Path with layers
 */
export function getPathWithLayers(...args) {
    return path.resolve(process.cwd(), ...args);
}