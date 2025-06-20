'use strict';

import { __dirname } from '../utils/path.util.js';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';

export class UserEntity {
    /**
     * id: string | 고유ID (UUID) (PK)
     * displayId: string | 표시용 ID (예: D0000001) (UNIQUE)
     * emailAddress: string | 이메일 주소
     * emailDomain: string | 이메일 도메인
     * password: string | 비밀번호
     * nickName: string | 닉네임 (UNIQUE)
     * profileImageUrl: string | 프로필 이미지 URL (NULLABLE)
     * createdAt: Date | 생성일시
     * updatedAt: Date | 수정일시
     * deletedAt: Date | 삭제일시
     *
     * @param {Object} data
     */
    constructor(data) {
        // this.id = data.id;
        // this.displayId = data.displayId;
        // this.emailAddress = data.emailAddress;
        // this.emailDomain = data.emailDomain;
        // this.password = data.password;
        // this.nickName = data.nickName;
        // this.createdAt = data.createdAt;
        // this.updatedAt = data.updatedAt;
        // this.deletedAt = data.deletedAt;

        Object.assign(this, {
            ...data,
            createdAt: dayjs(),
            updatedAt: dayjs(),
            deletedAt: null
        });
    }

    static fromJson(data) {
        return new UserEntity(data);
    }

    toJson() {
        return {
            id: this.id,
            displayId: this.displayId,
            emailAddress: this.emailAddress,
            emailDomain: this.emailDomain,
            nickName: this.nickName,
            profileImageUrl: this.profileImageUrl,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt
        };
    }

    static separateEmail(fullEmail) {
        const separatedEmail = fullEmail.split('@');

        if (separatedEmail.length !== 2) {
            throw new Error('Invalid Email!');
        }

        return {
            emailAddress: separatedEmail[0],
            emailDomain: separatedEmail[1]
        };
    }

    static async hashPassword(plainPassword) {
        return await bcrypt.hash(plainPassword, 10);
    }
}
