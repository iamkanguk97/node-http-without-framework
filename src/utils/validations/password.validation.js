'use strict';

import { JAVASCRIPT_TYPE_UNITS } from '../constants/unit.constant.js';

/**
 * Password validation
 * @param {string} password
 */
export function validatePassword(password) {
    // 필수 입력 검증
    if (!password) {
        throw new Error('비밀번호를 입력해주세요!');
    }
    // 타입 검증
    if (typeof password !== JAVASCRIPT_TYPE_UNITS.STRING) {
        throw new Error('비밀번호는 문자열이어야 합니다!');
    }
    // 길이 검증 (8-20자)
    if (password.length < 8 || password.length > 20) {
        throw new Error('비밀번호는 8자 이상 20자 이하여야 합니다!');
    }

    // 공백 문자 검증
    if (/\s/.test(password)) {
        throw new Error('비밀번호에 공백 문자를 포함할 수 없습니다!');
    }
    // 영문 대문자 포함 검증
    if (!/[A-Z]/.test(password)) {
        throw new Error('비밀번호에 영문 대문자를 포함해야 합니다!');
    }
    // 영문 소문자 포함 검증
    if (!/[a-z]/.test(password)) {
        throw new Error('비밀번호에 영문 소문자를 포함해야 합니다!');
    }
    // 숫자 포함 검증
    if (!/\d/.test(password)) {
        throw new Error('비밀번호에 숫자를 포함해야 합니다!');
    }
    // 특수문자 포함 검증
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        throw new Error('비밀번호에 특수문자를 포함해야 합니다!');
    }
    // 연속된 문자 검증 (3개 이상)
    if (/(.)\1{2,}/.test(password)) {
        throw new Error('비밀번호에 3개 이상의 연속된 문자를 포함할 수 없습니다!');
    }

    // 키보드 패턴 검증 (qwerty, 123456 등)
    const commonPatterns = ['qwerty', 'asdfgh', 'zxcvbn', '123456', '654321', 'abcdef', 'fedcba'];

    const lowerPassword = password.toLowerCase();
    for (const pattern of commonPatterns) {
        if (lowerPassword.includes(pattern)) {
            throw new Error('비밀번호에 키보드 패턴을 포함할 수 없습니다!');
        }
    }
}

/**
 * Password strength checker
 * @param {string} password
 * @returns {Object} { strength: 'weak'|'medium'|'strong', score: number, message: string }
 */
export function checkPasswordStrength(password) {
    if (!password) {
        return { strength: 'weak', score: 0, message: 'Password is empty' };
    }

    let score = 0;
    const messages = [];

    // 길이 점수
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;

    // 문자 종류 점수
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;

    // 복잡성 점수
    if (password.length >= 10 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password)) {
        score += 1;
    }

    // 특수문자 추가 점수
    const specialCharCount = (password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length;
    if (specialCharCount >= 2) score += 1;

    // 강도 판정
    let strength, message;
    if (score <= 3) {
        strength = 'weak';
        message = '비밀번호가 너무 약합니다. 더 복잡한 비밀번호를 사용하세요.';
    } else if (score <= 5) {
        strength = 'medium';
        message = '비밀번호가 보통 강도입니다. 더 강화할 수 있습니다.';
    } else {
        strength = 'strong';
        message = '강력한 비밀번호입니다!';
    }

    return { strength, score, message };
}
