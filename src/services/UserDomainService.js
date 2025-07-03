'use strict';

import { AppException } from '../exceptions/AppException.js';
import { ERROR_MESSAGE } from '../exceptions/ErrorMessage.js';

/**
 * User Domain Service
 * 사용자 도메인 관련 비즈니스 로직을 담당
 */
export class UserDomainService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * 이메일 중복 검사
     * @param {string} email 검사할 이메일
     * @throws {AppException} 이메일이 중복된 경우
     */
    async validateEmailUniqueness(email) {
        const existingUsers = await this.userRepository.findByEmail(email);

        if (existingUsers.length > 0) {
            throw new AppException(
                ERROR_MESSAGE.DUPLICATE_EMAIL.message,
                ERROR_MESSAGE.DUPLICATE_EMAIL.responseCode,
                400
            );
        }
    }

    /**
     * 닉네임 중복 검사
     * @param {string} nickName 검사할 닉네임
     * @throws {AppException} 닉네임이 중복된 경우
     */
    async validateNicknameUniqueness(nickName) {
        const existingUsers = await this.userRepository.findByNickname(nickName);

        if (existingUsers.length > 0) {
            throw new AppException(
                ERROR_MESSAGE.DUPLICATE_NICKNAME.message,
                ERROR_MESSAGE.DUPLICATE_NICKNAME.responseCode,
                400
            );
        }
    }

    /**
     * 사용자 생성 전 도메인 검증
     * @param {Object} userData 사용자 데이터
     */
    async validateUserCreation(userData) {
        const { email, nickName } = userData;

        // 병렬로 중복 검사 실행
        await Promise.all([this.validateEmailUniqueness(email), this.validateNicknameUniqueness(nickName)]);
    }

    /**
     * 사용자 로그인 검증
     * @param {string} email 이메일
     * @param {string} password 비밀번호
     * @returns {UserEntity} 인증된 사용자
     * @throws {AppException} 인증 실패 시
     */
    async authenticateUser(email, password) {
        const users = await this.userRepository.findByEmail(email);

        if (users.length === 0) {
            throw new AppException(
                ERROR_MESSAGE.USER_NOT_FOUND.message,
                ERROR_MESSAGE.USER_NOT_FOUND.responseCode,
                404
            );
        }

        const user = users[0];

        if (user.isDeleted()) {
            throw new AppException(
                ERROR_MESSAGE.USER_DELETED.message,
                ERROR_MESSAGE.USER_DELETED.responseCode,
                400
            );
        }

        const isPasswordValid = await user.verifyPassword(password);

        if (!isPasswordValid) {
            throw new AppException(
                ERROR_MESSAGE.INVALID_PASSWORD.message,
                ERROR_MESSAGE.INVALID_PASSWORD.responseCode,
                401
            );
        }

        return user;
    }
}
