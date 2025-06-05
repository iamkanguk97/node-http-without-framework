import REGEX from '../regex/index.js';
import { JAVASCRIPT_TYPE_UNITS } from '../constants/unit.constant.js';

/**
 * User email validation
 * @param {string} email
 * @returns {Object} { isValid: boolean, message?: string }
 */
export function validateEmail(email) {
    if (!email) {
        return { isValid: false, message: 'Email is Required!' };
    }
    if (typeof email !== JAVASCRIPT_TYPE_UNITS.STRING) {
        return { isValid: false, message: 'Email must be a string!' };
    }
    if (!REGEX.EMAIL.test(email)) {
        return { isValid: false, message: 'Invalid Email Format!' };
    }

    return { isValid: true };
}
