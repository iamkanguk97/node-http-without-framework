'use strict';

import { BaseValidator } from './base/BaseValidator.js';
import { ERROR_MESSAGE } from '../../exceptions/ErrorMessage.js';
import REGEX from '../regex/index.js';

export class NicknameValidator extends BaseValidator {
    constructor() {
        super();
        this.setValidationRules();
    }

    setValidationRules() {
        this.addValidationRule(this.isNotEmpty, ERROR_MESSAGE.NICKNAME_EMPTY);
        this.addValidationRule(this.isString, ERROR_MESSAGE.IS_NOT_STRING);
        this.addValidationRule(this.isLengthBetween(2, 10), ERROR_MESSAGE.NICKNAME_FORMAT_INVALID);
        this.addValidationRule(this.isRegexMatch(REGEX.NICKNAME), ERROR_MESSAGE.NICKNAME_FORMAT_INVALID);
    }

    static validate(nickname) {
        return new NicknameValidator().validate(nickname);
    }
}
