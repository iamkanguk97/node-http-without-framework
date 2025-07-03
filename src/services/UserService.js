'use strict';

import { userRepository } from '../repositories/UserRepository.js';
import { UserDomainService } from './UserDomainService.js';
import { DisplayIdEntity } from '../entities/DisplayId.js';
import { UserEntity } from '../entities/User.js';
import { UserCreateResponseDto } from '../dtos/UserDto.js';
import { uuidv7 } from '../utils/schema/schema.util.js';
import dayjs from 'dayjs';

class UserService {
    constructor(userRepository, userDomainService) {
        this.userRepository = userRepository;
        this.userDomainService = userDomainService;
    }

    /**
     * 사용자 생성
     * @param {UserCreateRequestDto} createUserDto 사용자 생성 요청 DTO
     * @returns {Promise<UserCreateResponseDto>} 생성된 사용자 응답 DTO
     */
    createUser = async (createUserDto) => {
        const { email, password, nickName } = createUserDto;

        // 1. 도메인 검증 (이메일/닉네임 중복 검사)
        await this.userDomainService.validateUserCreation({
            email,
            nickName
        });

        // 2. 고유 ID 생성
        const userId = uuidv7();
        const displayId = await DisplayIdEntity.generateDisplayId();

        // 3. 사용자 엔티티 생성 (팩토리 메서드 활용)
        const userEntity = await UserEntity.createUser({
            id: userId,
            displayId,
            email,
            password,
            nickName
        });

        // 4. 데이터베이스에 저장
        const savedUser = await this.userRepository.create(userEntity);

        // 5. 응답 DTO 생성
        return new UserCreateResponseDto(
            savedUser.id,
            savedUser.displayId,
            savedUser.getFullEmail(),
            savedUser.nickName
        );
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
