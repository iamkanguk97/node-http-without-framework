'use strict';

import REGEX from '../regex/index.js';
import { JAVASCRIPT_TYPE_UNITS } from '../constants/unit.constant.js';

/**
 * User nickname validation
 * @param {string} nickName
 * @returns {Object} { isValid: boolean, message?: string }
 */
export function validateNickname(nickName) {
    if (!nickName) {
        return { isValid: false, message: 'Nickname is Required!' };
    }
    if (typeof nickName !== JAVASCRIPT_TYPE_UNITS.STRING) {
        return { isValid: false, message: 'Nickname must be a string!' };
    }
    if (nickName.length < 2 || nickName.length > 10) {
        return { isValid: false, message: 'Nickname must be between 2 and 10 characters!' };
    }
    if (!REGEX.NICKNAME.test(nickName)) {
        return { isValid: false, message: 'Nickname must contain only letters, numbers, and underscores!' };
    }

    return { isValid: true };
}
