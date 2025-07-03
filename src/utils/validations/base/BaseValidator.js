'use strict';

import { BadRequestException } from '../../../exceptions/AppException.js';
import { BaseValidationUtil } from './BaseValidationUtil.js';

export class BaseValidator extends BaseValidationUtil {
    constructor() {
        super();
        this.validationRules = [];
    }

    addValidationRule(fn, errorInfo) {
        this.validationRules.push({ fn, errorInfo });
        return this;
    }

    validate(data) {
        for (const rule of this.validationRules) {
            if (!rule.fn(data)) {
                throw new BadRequestException(rule.errorInfo);
            }
        }

        return true;
    }
}
