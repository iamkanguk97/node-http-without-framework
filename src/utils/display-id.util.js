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

/**
 * DisplayId 관련 유틸리티 함수들
 */

/**
 * 16진수 DisplayId를 10진수로 변환합니다.
 * @param {string} displayId - DisplayId (예: "U000000A")
 * @param {string} prefix - 접두사 (기본값: "U")
 * @returns {number} 10진수 값
 */
export function displayIdToDecimal(displayId, prefix = 'U') {
    if (!displayId || typeof displayId !== 'string') {
        throw new Error('유효하지 않은 DisplayId입니다.');
    }

    if (!displayId.startsWith(prefix)) {
        throw new Error(`DisplayId는 ${prefix}로 시작해야 합니다.`);
    }

    const hexPart = displayId.slice(prefix.length);
    const decimal = parseInt(hexPart, 16);

    if (isNaN(decimal)) {
        throw new Error('DisplayId의 16진수 부분이 유효하지 않습니다.');
    }

    return decimal;
}

/**
 * 10진수를 DisplayId로 변환합니다.
 * @param {number} decimal - 10진수 값
 * @param {string} prefix - 접두사 (기본값: "U")
 * @param {number} digits - 자릿수 (기본값: 7)
 * @returns {string} DisplayId
 */
export function decimalToDisplayId(decimal, prefix = 'U', digits = 7) {
    if (!Number.isInteger(decimal) || decimal < 0) {
        throw new Error('10진수 값은 0 이상의 정수여야 합니다.');
    }

    const maxValue = Math.pow(16, digits) - 1;
    if (decimal > maxValue) {
        throw new Error(`값이 너무 큽니다. 최대값: ${maxValue}`);
    }

    const hexPart = decimal.toString(16).toUpperCase().padStart(digits, '0');
    return `${prefix}${hexPart}`;
}

/**
 * DisplayId 범위를 생성합니다.
 * @param {string} startDisplayId - 시작 DisplayId
 * @param {string} endDisplayId - 종료 DisplayId
 * @param {string} prefix - 접두사 (기본값: "U")
 * @returns {string[]} DisplayId 배열
 */
export function generateDisplayIdRange(startDisplayId, endDisplayId, prefix = 'U') {
    const startDecimal = displayIdToDecimal(startDisplayId, prefix);
    const endDecimal = displayIdToDecimal(endDisplayId, prefix);

    if (startDecimal > endDecimal) {
        throw new Error('시작 DisplayId가 종료 DisplayId보다 클 수 없습니다.');
    }

    const range = [];
    const digits = startDisplayId.length - prefix.length;

    for (let i = startDecimal; i <= endDecimal; i++) {
        range.push(decimalToDisplayId(i, prefix, digits));
    }

    return range;
}

/**
 * DisplayId가 유효한 범위 내에 있는지 확인합니다.
 * @param {string} displayId - 확인할 DisplayId
 * @param {string} minDisplayId - 최소 DisplayId
 * @param {string} maxDisplayId - 최대 DisplayId
 * @param {string} prefix - 접두사 (기본값: "U")
 * @returns {boolean} 범위 내에 있는지 여부
 */
export function isDisplayIdInRange(displayId, minDisplayId, maxDisplayId, prefix = 'U') {
    try {
        const targetDecimal = displayIdToDecimal(displayId, prefix);
        const minDecimal = displayIdToDecimal(minDisplayId, prefix);
        const maxDecimal = displayIdToDecimal(maxDisplayId, prefix);

        return targetDecimal >= minDecimal && targetDecimal <= maxDecimal;
    } catch (error) {
        return false;
    }
}

/**
 * DisplayId 패턴을 검증합니다.
 * @param {string} displayId - 검증할 DisplayId
 * @param {string} prefix - 접두사 (기본값: "U")
 * @param {number} digits - 자릿수 (기본값: 7)
 * @returns {boolean} 유효한 패턴인지 여부
 */
export function validateDisplayIdPattern(displayId, prefix = 'U', digits = 7) {
    if (!displayId || typeof displayId !== 'string') {
        return false;
    }

    // 길이 체크
    if (displayId.length !== prefix.length + digits) {
        return false;
    }

    // 접두사 체크
    if (!displayId.startsWith(prefix)) {
        return false;
    }

    // 16진수 부분 체크
    const hexPart = displayId.slice(prefix.length);
    const hexRegex = /^[0-9A-F]+$/;

    return hexRegex.test(hexPart);
}
