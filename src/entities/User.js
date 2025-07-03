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
        Object.assign(this, {
            ...data,
            createdAt: data.createdAt || dayjs(),
            updatedAt: data.updatedAt || dayjs(),
            deletedAt: data.deletedAt || null
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

    /**
     * 완전한 이메일 주소를 반환
     * @returns {string} 전체 이메일 주소
     */
    getFullEmail() {
        return `${this.emailAddress}@${this.emailDomain}`;
    }

    /**
     * 이메일을 주소와 도메인으로 분리
     * @param {string} fullEmail 전체 이메일 주소
     * @returns {Object} {emailAddress, emailDomain}
     */
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

    /**
     * 비밀번호를 해시화
     * @param {string} plainPassword 평문 비밀번호
     * @returns {Promise<string>} 해시화된 비밀번호
     */
    static async hashPassword(plainPassword) {
        return await bcrypt.hash(plainPassword, 10);
    }

    /**
     * 비밀번호 검증
     * @param {string} plainPassword 평문 비밀번호
     * @returns {Promise<boolean>} 비밀번호 일치 여부
     */
    async verifyPassword(plainPassword) {
        return await bcrypt.compare(plainPassword, this.password);
    }

    /**
     * 사용자 생성을 위한 팩토리 메서드
     * @param {Object} userData 사용자 데이터
     * @returns {UserEntity} 새로운 사용자 엔티티
     */
    static async createUser(userData) {
        const { email, password, nickName, id, displayId } = userData;
        const { emailAddress, emailDomain } = this.separateEmail(email);
        const hashedPassword = await this.hashPassword(password);

        return new UserEntity({
            id,
            displayId,
            emailAddress,
            emailDomain,
            password: hashedPassword,
            nickName,
            profileImageUrl: null
        });
    }

    /**
     * 사용자 정보 업데이트
     * @param {Object} updateData 업데이트할 데이터
     */
    updateUser(updateData) {
        Object.assign(this, {
            ...updateData,
            updatedAt: dayjs()
        });
    }

    /**
     * 사용자 삭제 (소프트 삭제)
     */
    deleteUser() {
        this.deletedAt = dayjs();
        this.updatedAt = dayjs();
    }

    /**
     * 삭제된 사용자인지 확인
     * @returns {boolean} 삭제 여부
     */
    isDeleted() {
        return this.deletedAt !== null;
    }
}
