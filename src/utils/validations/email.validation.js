'use strict';

import REGEX from '../regex/index.js';
import { JAVASCRIPT_TYPE_UNITS } from '../constants/unit.constant.js';

/**
 * User email validation
 * @param {string} email
 */
export function validateEmail(email) {
  if (!email) {
    throw new Error('이메일을 입력해주세요!');
  }
  if (typeof email !== JAVASCRIPT_TYPE_UNITS.STRING) {
    throw new Error('이메일은 문자열이어야 합니다!');
  }
  if (!REGEX.EMAIL.test(email)) {
    throw new Error('이메일 형식이 올바르지 않습니다!');
  }
}
