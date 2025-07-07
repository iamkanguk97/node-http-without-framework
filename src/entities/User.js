'use strict';

import dayjs from 'dayjs';
import { BadRequestException } from '../exceptions/AppException.js';
import { ERROR_MESSAGE } from '../exceptions/ErrorMessage.js';
import { JAVASCRIPT_TYPE_UNITS } from '../utils/constants/unit.constant.js';
import IdGeneratorUtil from '../utils/id-generator.util.js';
import bcrypt from 'bcrypt';

export class UserEntity {
    /**
     * id: string | 고유ID (UUID) (PK)
     * displayId: string | 표시용 ID (예: D0000001) (UNIQUE)
     * emailLocalPart: string | 이메일 주소
     * emailDomainPart: string | 이메일 도메인
     * => (emailAddress, emailDomain) 조합으로 UNIQUE
     * password: string | 비밀번호
     * nickname: string | 닉네임 (UNIQUE)
     * profileImageUrl: string | 프로필 이미지 URL (NULLABLE)
     * createdAt: Date | 생성일시
     * updatedAt: Date | 수정일시
     * deletedAt: Date | 삭제일시
     *
     * @param {Object} data
     */
    constructor(data) {
        const currentTime = dayjs();

        Object.assign(this, {
            ...data,
            createdAt: data.createdAt ?? currentTime,
            updatedAt: data.updatedAt ?? currentTime,
            deletedAt: data.deletedAt ?? null
        });
    }

    static async create(email, password, nickname) {
        const emailParts = this.parseEmail(email);

        return new UserEntity({
            id: IdGeneratorUtil.generateUniqueId(),
            displayId: await IdGeneratorUtil.generateDisplayId(IdGeneratorUtil.DISPLAY_ID_TARGET.USER),
            emailLocalPart: emailParts.emailLocalPart,
            emailDomainPart: emailParts.emailDomainPart,
            password: await this.hashPassword(password),
            nickname,
            profileImageUrl: null
        });
    }

    // DB(JSON)로부터 데이터를 조회해서 UserEntity 인스턴스를 생성하는 메서드
    static fromJson(userData) {
        return new UserEntity({
            id: userData.id,
            displayId: userData.displayId,
            emailLocalPart: userData.emailLocalPart,
            emailDomainPart: userData.emailDomainPart,
            password: userData.password,
            nickname: userData.nickname,
            profileImageUrl: userData.profileImageUrl,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
            deletedAt: userData.deletedAt
        });
    }

    // JSON 형태로 변환 (기존 데이터 구조와 호환)
    toJson() {
        return {
            id: this.id,
            displayId: this.displayId,
            emailLocalPart: this.emailLocalPart,
            emailDomainPart: this.emailDomainPart,
            password: this.password,
            nickname: this.nickname,
            profileImageUrl: this.profileImageUrl,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt
        };
    }

    static async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    // 이메일 파싱하는 로직 -> 도메인 로직이 맞음
    // 정상적인 유저 생성을 위해서는 이메일 파싱이 필요함 -> 유저 도메인 로직
    static parseEmail(email) {
        if (!email || typeof email !== JAVASCRIPT_TYPE_UNITS.STRING) {
            throw new BadRequestException(ERROR_MESSAGE.IS_NOT_STRING);
        }

        const emailParts = email.split('@');
        if (emailParts.length !== 2 || emailParts[0].length === 0 || emailParts[1].length === 0) {
            throw new BadRequestException(ERROR_MESSAGE.EMAIL_FORMAT_INVALID);
        }

        return {
            emailLocalPart: emailParts[0],
            emailDomainPart: emailParts[1]
        };
    }

    // 전체 이메일 주소 반환
    getFullEmail() {
        return `${this.emailLocalPart}@${this.emailDomainPart}`;
    }
}
