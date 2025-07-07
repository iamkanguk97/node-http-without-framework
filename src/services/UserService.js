'use strict';

import { userRepository } from '../repositories/UserRepository.js';
import { UserDomainService } from './UserDomainService.js';
import { UserEntity } from '../entities/User.js';
import { ConflictException } from '../exceptions/AppException.js';
import { ERROR_MESSAGE } from '../exceptions/ErrorMessage.js';
import { UserCreateResponseDto } from '../dtos/UserDto.js';

class UserService {
    constructor(userRepository, userDomainService) {
        this.userRepository = userRepository;
        this.userDomainService = userDomainService;
    }

    createUser = async (createUserDto) => {
        // Business Validation Check
        await Promise.all([
            this.checkEmailUnique(createUserDto.email),
            this.checkNicknameUnique(createUserDto.nickname)
        ]);

        const createdUserEntity = await UserEntity.create(
            createUserDto.email,
            createUserDto.password,
            createUserDto.nickname
        );

        await this.userRepository.create(createdUserEntity);

        return UserCreateResponseDto.fromEntity(createdUserEntity);
    };

    checkEmailUnique = async (email) => {
        const { emailLocalPart, emailDomainPart } = UserEntity.parseEmail(email);
        const result = await this.userRepository.findByEmail(emailLocalPart, emailDomainPart);

        if (result) {
            throw new ConflictException(ERROR_MESSAGE.DUPLICATE_EMAIL);
        }
    };

    checkNicknameUnique = async (nickname) => {
        if (await this.userRepository.findByNickname(nickname)) {
            throw new ConflictException(ERROR_MESSAGE.DUPLICATE_NICKNAME);
        }
    };

    /**
     * 사용자 로그인
     * @param {string} email 이메일
     * @param {string} password 비밀번호
     * @returns {Promise<UserEntity>} 인증된 사용자 엔티티
     */
    loginUser = async (email, password) => {
        return await this.userDomainService.authenticateUser(email, password);
    };

    /**
     * ID로 사용자 조회
     * @param {string} id 사용자 ID
     * @returns {Promise<UserEntity|null>} 사용자 엔티티
     */
    findUserById = async (id) => {
        const result = await this.userRepository.findById(id);
        return result;
    };

    /**
     * 이메일로 사용자 조회
     * @param {string} email 이메일
     * @returns {Promise<UserEntity[]>} 사용자 엔티티 배열
     */
    findUserByEmail = async (email) => {
        return await this.userRepository.findByEmail(email);
    };

    /**
     * 닉네임으로 사용자 조회
     * @param {string} nickName 닉네임
     * @returns {Promise<UserEntity[]>} 사용자 엔티티 배열
     */
    findUserByNickname = async (nickName) => {
        return await this.userRepository.findByNickname(nickName);
    };

    /**
     * 모든 사용자 조회
     * @returns {Promise<UserEntity[]>} 모든 사용자 엔티티 배열
     */
    findAllUsers = async () => {
        return await this.userRepository.findAll();
    };

    // 레거시 메서드들 (하위 호환성을 위해 유지)
    /**
     * @deprecated Domain Service의 validateNicknameUniqueness를 사용하세요
     */
    checkIsDuplicateNickname = async (nickname) => {
        await this.userDomainService.validateNicknameUniqueness(nickname);
    };

    /**
     * @deprecated Domain Service의 validateEmailUniqueness를 사용하세요
     */
    checkIsDuplicateEmail = async (email) => {
        await this.userDomainService.validateEmailUniqueness(email);
    };
}

// UserDomainService 인스턴스 생성
const userDomainService = new UserDomainService(userRepository);

export const userService = new UserService(userRepository, userDomainService);
