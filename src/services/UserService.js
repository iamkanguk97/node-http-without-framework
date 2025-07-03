'use strict';

import { userRepository } from '../repositories/UserRepository.js';
import { DisplayIdEntity } from '../entities/DisplayId.js';
import { UserEntity } from '../entities/User.js';
import { UserCreateResponseDto } from '../dtos/UserDto.js';
import { uuidv7 } from '../utils/schema/schema.util.js';
import dayjs from 'dayjs';

class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * 사용자 생성 서비스
     *
     * 비즈니스 로직:
     * 1. 중복 검증 (이메일, 닉네임)
     * 2. Domain 객체 생성
     * 3. 저장소 저장
     * 4. DisplayId 시퀀스 업데이트
     *
     * @param {Object} domainCreationData - { email, password, nickName }
     * @returns {Promise<UserEntity>}
     */
    createUser = async (domainCreationData) => {
        try {
            // 1단계: 비즈니스 규칙 검증
            await this.validateBusinessRules(domainCreationData);

            // 2단계: Domain 객체 생성
            const userEntity = await this.createUserEntity(domainCreationData);

            // 3단계: 저장소에 저장
            const savedUser = await this.saveUser(userEntity);

            // 4단계: 후속 처리 (DisplayId 시퀀스 업데이트)
            await this.performPostCreationTasks();

            return savedUser;
        } catch (error) {
            throw new Error(`User creation failed: ${error.message}`);
        }
    };

    /**
     * 비즈니스 규칙 검증
     * @private
     * @param {Object} domainCreationData
     */
    async validateBusinessRules(domainCreationData) {
        const { email, nickName } = domainCreationData;

        // 병렬로 중복 검증 수행
        await Promise.all([this.checkEmailDuplication(email), this.checkNicknameDuplication(nickName)]);
    }

    /**
     * 이메일 중복 검증
     * @private
     * @param {string} email
     */
    async checkEmailDuplication(email) {
        const existingUsers = await this.userRepository.findByEmail(email);

        if (existingUsers.length > 0) {
            throw new Error('이미 존재하는 이메일입니다.');
        }
    }

    /**
     * 닉네임 중복 검증
     * @private
     * @param {string} nickName
     */
    async checkNicknameDuplication(nickName) {
        const existingUsers = await this.userRepository.findByNickname(nickName);

        if (existingUsers.length > 0) {
            throw new Error('이미 존재하는 닉네임입니다.');
        }
    }

    /**
     * UserEntity 생성
     * @private
     * @param {Object} domainCreationData
     * @returns {Promise<UserEntity>}
     */
    async createUserEntity(domainCreationData) {
        try {
            return await UserEntity.createNew(domainCreationData);
        } catch (error) {
            throw new Error(`Domain object creation failed: ${error.message}`);
        }
    }

    /**
     * 사용자 저장
     * @private
     * @param {UserEntity} userEntity
     * @returns {Promise<UserEntity>}
     */
    async saveUser(userEntity) {
        try {
            return await this.userRepository.create(userEntity);
        } catch (error) {
            throw new Error(`Database save failed: ${error.message}`);
        }
    }

    /**
     * 생성 후 후속 처리
     * @private
     */
    async performPostCreationTasks() {
        try {
            // DisplayId 시퀀스를 다음으로 설정
            await DisplayIdEntity.setNextUserSeqDisplayId();
        } catch (error) {
            // 후속 처리 실패는 로그만 남기고 에러를 던지지 않음
            console.warn('Post creation task failed:', error.message);
        }
    }

    /**
     * 사용자 검증 헬퍼 메서드들
     */

    /**
     * 이메일 중복 검증 (외부 호출용)
     * @param {string} email
     * @returns {Promise<boolean>}
     */
    async isEmailDuplicated(email) {
        try {
            const existingUsers = await this.userRepository.findByEmail(email);
            return existingUsers.length > 0;
        } catch (error) {
            throw new Error(`Email duplication check failed: ${error.message}`);
        }
    }

    /**
     * 닉네임 중복 검증 (외부 호출용)
     * @param {string} nickName
     * @returns {Promise<boolean>}
     */
    async isNicknameDuplicated(nickName) {
        try {
            const existingUsers = await this.userRepository.findByNickname(nickName);
            return existingUsers.length > 0;
        } catch (error) {
            throw new Error(`Nickname duplication check failed: ${error.message}`);
        }
    }

    findUserById = async (id) => {
        const result = await this.userRepository.findById(id);
        return result;
    };

    /**
     * @Service
     * @param {string} nickname
     */
    checkIsDuplicateNickname = async (nickname) => {
        const result = await this.userRepository.findByNickname(nickname);

        if (result.length > 0) {
            throw new Error('중복된 닉네임입니다.');
        }
    };

    /**
     * @Service
     * @param {string} email
     */
    checkIsDuplicateEmail = async (email) => {
        const result = await this.userRepository.findByEmail(email);

        if (result.length > 0) {
            throw new Error('중복된 이메일입니다.');
        }
    };
}

export const userService = new UserService(userRepository);
