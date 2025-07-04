'use strict';

import { EmailValidator } from '../utils/validations/EmailValidator.js';
import { NicknameValidator } from '../utils/validations/NicknameValidator.js';
import { PasswordValidator } from '../utils/validations/PasswordValidator.js';

export class UserCreateRequestDto {
    constructor(email, password, nickname) {
        this.email = EmailValidator.validate(email);
        this.nickname = NicknameValidator.validate(nickname);
        this.password = PasswordValidator.validate(password);
    }

    static create(email, password, nickname) {
        return new UserCreateRequestDto(email, password, nickname);
    }
}

export class UserCreateResponseDto {
    constructor(id, displayId, email, nickName) {
        this.id = id;
        this.displayId = displayId;
        this.email = email;
        this.nickName = nickName;
    }

    static fromEntity(userEntity) {
        return;
    }
}
