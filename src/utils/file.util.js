'use strict';

import { promises as fs } from 'fs';
import path from 'path';

/**
 * 디렉토리가 존재하지 않으면 생성합니다.
 * @param {string} dirPath - 생성할 디렉토리 경로
 */
export async function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`📁 Created directory: ${dirPath}`);
    }
}

/**
 * 파일이 존재하는지 확인합니다.
 * @param {string} filePath - 확인할 파일 경로
 * @returns {boolean} 파일 존재 여부
 */
export function fileExists(filePath) {
    return fs.existsSync(filePath);
}

/**
 * JSON 파일을 생성합니다.
 * @param {string} filePath - 생성할 파일 경로
 * @param {any} initialData - 초기 데이터 (기본값: 빈 배열)
 */
export function createJsonFile(filePath, initialData = []) {
    const jsonData = JSON.stringify(initialData, null, 2);
    fs.writeFileSync(filePath, jsonData, 'utf8');
    console.log(`📄 Created data file: ${filePath}`);
}

/**
 * 디렉토리 내의 모든 .js 파일을 가져옵니다.
 * @param {string} dirPath - 스캔할 디렉토리 경로
 * @returns {string[]} .js 파일 이름 배열 (확장자 제외)
 */
export function getJsFiles(dirPath) {
    if (!fs.existsSync(dirPath)) {
        return [];
    }

    return fs
        .readdirSync(dirPath)
        .filter(file => file.endsWith('.js'))
        .map(file => path.basename(file, '.js'));
}
