'use strict';

import dayjs from 'dayjs';
import { BadRequestException } from '../exceptions/AppException.js';
import { ERROR_MESSAGE } from '../exceptions/ErrorMessage.js';
import { generateUniqueId } from '../utils/id-generator.util.js';

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
        Object.assign(this, {
            ...data,
            createdAt: data.createdAt || dayjs(),
            updatedAt: data.updatedAt || dayjs(),
            deletedAt: data.deletedAt || null
        });
    }

    static async create(email, password, nickname) {
        const emailParts = this.parseEmail(email);
        const hashedPassword = password;

        return new UserEntity({
            id: generateUniqueId(),
            displayId: '',
            emailLocalPart: emailParts.emailLocalPart,
            emailDomainPart: emailParts.emailDomainPart,
            password: hashedPassword,
            nickname,
            profileImageUrl: null,
            createdAt: dayjs(),
            updatedAt: dayjs()
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
            updatedAt: userData.updatedAt
        });
    }

    // 이메일 파싱하는 로직 -> 도메인 로직이 맞음
    // 정상적인 유저 생성을 위해서는 이메일 파싱이 필요함 -> 유저 도메인 로직
    static parseEmail(email) {
        if (!email || typeof email !== 'string') {
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
}
