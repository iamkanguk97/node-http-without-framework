'use strict';

import path from 'path';
import { __dirname } from '../utils/path.util.js';
import { readFileWithFs, writeJsonFileWithFs } from '../utils/file.util.js';

export class DisplayIdEntity {
    static displayIdDataPath = path.join(__dirname(), '../../data/DisplayId.json');
    static HEX_DIGITS = 7;

    static getParsedDisplayIdData = async () => {
        const rawDisplayIdData = await readFileWithFs(this.displayIdDataPath);
        return JSON.parse(rawDisplayIdData);
    };

    static getUserSeqDisplayId = async () => {
        const displayUserIdData = await this.getParsedDisplayIdData();

        if (!(displayUserIdData && displayUserIdData.length)) {
            throw new Error('DisplayId 설정이 잘못되었습니다.');
        }

        return displayUserIdData[0].userId;
    };

    /**
     * DisplayId를 다음 값으로 업데이트합니다.
     * 16진수 기반으로 증가시킵니다. (U0000009 -> U000000A)
     */
    static setNextUserSeqDisplayId = async () => {
        const displayUserIdData = await this.getParsedDisplayIdData();

        if (!(displayUserIdData && displayUserIdData.length)) {
            throw new Error('DisplayId 설정이 잘못되었습니다.');
        }

        const currentDisplayId = displayUserIdData[0].userId;
        const nextDisplayId = this.generateNextDisplayId(currentDisplayId);

        displayUserIdData[0].userId = nextDisplayId;

        await writeJsonFileWithFs(this.displayIdDataPath, displayUserIdData);

        return nextDisplayId;
    };

    /**
     * 현재 DisplayId에서 다음 DisplayId를 생성합니다.
     * @param {string} currentDisplayId - 현재 DisplayId (예: "U0000001")
     * @returns {string} 다음 DisplayId (예: "U0000002")
     */
    static generateNextDisplayId = (currentDisplayId) => {
        // 접두사 제거 (U 제거)
        const hexPart = currentDisplayId.slice(1);
        console.log(hexPart);

        // 16진수를 10진수로 변환
        const currentNumber = parseInt(hexPart, 16);
        console.log(currentNumber);

        // 최대값 체크 (7자리 16진수의 최대값)
        const maxValue = Math.pow(16, this.HEX_DIGITS) - 1; // 0xFFFFFFF

        if (currentNumber >= maxValue) {
            throw new Error(
                `DisplayId가 최대값에 도달했습니다. 현재: ${currentDisplayId}, 최대: ${this.PREFIX}${maxValue
                    .toString(16)
                    .toUpperCase()
                    .padStart(this.HEX_DIGITS, '0')}`
            );
        }

        // 다음 숫자 계산
        const nextNumber = currentNumber + 1;

        // 16진수로 변환하고 대문자로 변환, 7자리로 패딩
        const nextHexPart = nextNumber.toString(16).toUpperCase().padStart(this.HEX_DIGITS, '0');

        return `${this.PREFIX}${nextHexPart}`;
    };

    /**
     * DisplayId의 유효성을 검사합니다.
     * @param {string} displayId - 검사할 DisplayId
     * @returns {boolean} 유효한 DisplayId인지 여부
     */
    static isValidDisplayId = (displayId) => {
        if (!displayId || typeof displayId !== 'string') {
            return false;
        }

        // 접두사 체크
        if (!displayId.startsWith(this.PREFIX)) {
            return false;
        }

        // 길이 체크
        if (displayId.length !== this.PREFIX.length + this.HEX_DIGITS) {
            return false;
        }

        // 16진수 부분 체크
        const hexPart = displayId.slice(this.PREFIX.length);
        const hexRegex = /^[0-9A-F]+$/;

        return hexRegex.test(hexPart);
    };

    /**
     * DisplayId 통계 정보를 반환합니다.
     * @returns {Promise<Object>} 통계 정보
     */
    static getDisplayIdStats = async () => {
        const displayUserIdData = await this.getParsedDisplayIdData();

        if (!(displayUserIdData && displayUserIdData.length)) {
            throw new Error('DisplayId 설정이 잘못되었습니다.');
        }

        const currentDisplayId = displayUserIdData[0].userId;
        const hexPart = currentDisplayId.slice(this.PREFIX.length);
        const currentNumber = parseInt(hexPart, 16);
        const maxValue = Math.pow(16, this.HEX_DIGITS) - 1;

        return {
            current: currentDisplayId,
            currentNumber,
            maxValue,
            remaining: maxValue - currentNumber,
            usagePercentage: ((currentNumber / maxValue) * 100).toFixed(2) + '%'
        };
    };
}
