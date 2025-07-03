'use strict';

import { ERROR_MESSAGE } from '../../exceptions/ErrorMessage.js';
import { BaseValidator } from './base/BaseValidator.js';

export class PasswordValidator extends BaseValidator {
    constructor() {
        super();
        this.setValidationRules();
    }

    setValidationRules() {
        this.addValidationRule(this.isNotEmpty, ERROR_MESSAGE.PASSWORD_EMPTY);
        this.addValidationRule(this.isString, ERROR_MESSAGE.IS_NOT_STRING);
        this.addValidationRule(this.isLengthBetween(8, 20), ERROR_MESSAGE.PASSWORD_FORMAT_INVALID);
    }

    static validate(password) {
        return new PasswordValidator().validate(password);
    }
}
