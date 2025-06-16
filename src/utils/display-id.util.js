'use strict';

import fs from 'fs';
import path from 'path';
import { getDataDirectoryPath } from './schema.util.js';

/**
 * 스키마별 Display ID 접두사 매핑
 */
const DISPLAY_ID_PREFIXES = {
    User: 'U',
    Post: 'P',
    Comment: 'C',
    Category: 'CT',
    Admin: 'A',
    Order: 'O',
    Product: 'PR'
};

/**
 * Display ID 관리를 위한 메타데이터 파일 경로를 가져옵니다.
 * @returns {string} 메타데이터 파일 경로
 */
function getMetaDataFilePath() {
    const dataDir = getDataDirectoryPath();
    return path.join(dataDir, '_metadata.json');
}

/**
 * 메타데이터를 읽어옵니다.
 * @returns {Object} 메타데이터 객체
 */
function readMetaData() {
    const metaFilePath = getMetaDataFilePath();

    if (!fs.existsSync(metaFilePath)) {
        // 메타데이터 파일이 없으면 초기 구조로 생성
        const initialMeta = {
            displayIdCounters: {}
        };
        fs.writeFileSync(metaFilePath, JSON.stringify(initialMeta, null, 2), 'utf8');
        return initialMeta;
    }

    const metaContent = fs.readFileSync(metaFilePath, 'utf8');
    return JSON.parse(metaContent);
}

/**
 * 메타데이터를 저장합니다.
 * @param {Object} metaData - 저장할 메타데이터
 */
function writeMetaData(metaData) {
    const metaFilePath = getMetaDataFilePath();
    fs.writeFileSync(metaFilePath, JSON.stringify(metaData, null, 2), 'utf8');
}

/**
 * 스키마 이름에 대한 접두사를 가져옵니다.
 * @param {string} schemaName - 스키마 이름
 * @returns {string} 접두사
 */
function getPrefix(schemaName) {
    return DISPLAY_ID_PREFIXES[schemaName] || schemaName.charAt(0).toUpperCase();
}

/**
 * 숫자를 7자리 패딩된 문자열로 변환합니다.
 * @param {number} num - 변환할 숫자
 * @returns {string} 패딩된 문자열 (예: 1 -> "0000001")
 */
function padNumber(num) {
    return num.toString().padStart(7, '0');
}

/**
 * 특정 스키마의 다음 Display ID를 생성합니다.
 * @param {string} schemaName - 스키마 이름 (예: 'User', 'Post')
 * @returns {string} Display ID (예: 'U0000001', 'P0000001')
 */
export function generateNextDisplayId(schemaName) {
    const metaData = readMetaData();

    if (!metaData.displayIdCounters[schemaName]) {
        metaData.displayIdCounters[schemaName] = 0;
    }

    metaData.displayIdCounters[schemaName] += 1;
    const nextNumber = metaData.displayIdCounters[schemaName];

    writeMetaData(metaData);

    const prefix = getPrefix(schemaName);
    const paddedNumber = padNumber(nextNumber);

    return `${prefix}${paddedNumber}`;
}

/**
 * 특정 스키마의 현재 최대 Display ID 번호를 가져옵니다.
 * @param {string} schemaName - 스키마 이름
 * @returns {number} 현재 최대 번호
 */
export function getCurrentMaxDisplayIdNumber(schemaName) {
    const metaData = readMetaData();
    return metaData.displayIdCounters[schemaName] || 0;
}

/**
 * 특정 스키마의 Display ID 카운터를 재설정합니다.
 * @param {string} schemaName - 스키마 이름
 * @param {number} value - 설정할 값 (기본값: 0)
 */
export function resetDisplayIdCounter(schemaName, value = 0) {
    const metaData = readMetaData();
    metaData.displayIdCounters[schemaName] = value;
    writeMetaData(metaData);
    console.log(`🔄 Reset display ID counter for ${schemaName} to ${value}`);
}

/**
 * Display ID가 유효한 형식인지 검증합니다.
 * @param {string} displayId - 검증할 Display ID
 * @param {string} schemaName - 스키마 이름
 * @returns {boolean} 유효성 여부
 */
export function validateDisplayId(displayId, schemaName) {
    const prefix = getPrefix(schemaName);
    const pattern = new RegExp(`^${prefix}\\d{7}$`);
    return pattern.test(displayId);
}

/**
 * Display ID에서 숫자 부분을 추출합니다.
 * @param {string} displayId - Display ID
 * @returns {number} 숫자 부분
 */
export function extractNumberFromDisplayId(displayId) {
    const numberPart = displayId.replace(/^[A-Z]+/, '');
    return parseInt(numberPart, 10);
}
