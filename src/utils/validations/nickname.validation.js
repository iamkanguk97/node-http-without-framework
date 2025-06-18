'use strict';

import REGEX from '../regex/index.js';
import { JAVASCRIPT_TYPE_UNITS } from '../constants/unit.constant.js';

/**
 * User nickname validation
 * @param {string} nickName
 */
export function validateNickname(nickName) {
  if (!nickName) {
    throw new Error('닉네임을 입력해주세요!');
  }
  if (typeof nickName !== JAVASCRIPT_TYPE_UNITS.STRING) {
    throw new Error('닉네임은 문자열이어야 합니다!');
  }
  if (nickName.length < 2 || nickName.length > 10) {
    throw new Error('닉네임은 2자 이상 10자 이하여야 합니다!');
  }
  if (!REGEX.NICKNAME.test(nickName)) {
    throw new Error('닉네임은 영문자, 숫자, 언더바만 사용할 수 있습니다!');
  }
}
