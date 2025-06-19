export class UserCreateRequestDto {
    constructor(email, password, nickName) {
        this.email = email;
        this.password = password;
        this.nickName = nickName;
    }
}

export class UserCreateResponseDto {
    constructor(id, displayId, email, nickName) {
        this.id = id;
        this.displayId = displayId;
        this.email = email;
        this.nickName = nickName;
    }
}
