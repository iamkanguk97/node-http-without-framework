'use strict';

import { ERROR_MESSAGE } from '../../exceptions/ErrorMessage.js';
import { BaseValidator } from './base/BaseValidator.js';
import REGEX from '../regex/index.js';

export class EmailValidator extends BaseValidator {
    constructor() {
        super();
        this.setValidationRules();
    }

    setValidationRules() {
        this.addValidationRule(this.isNotEmpty, ERROR_MESSAGE.EMAIL_EMPTY);
        this.addValidationRule(this.isString, ERROR_MESSAGE.IS_NOT_STRING);
        this.addValidationRule(this.isRegexMatch(REGEX.EMAIL), ERROR_MESSAGE.EMAIL_FORMAT_INVALID);
    }

    static validate(email) {
        return new EmailValidator().validate(email);
    }
}
