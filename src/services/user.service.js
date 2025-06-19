'use strict';

import { userRepository } from '../repositories/user.repository.js';
import { DisplayIdEntity } from '../entities/DisplayId.js';
import { v7 as uuidv7 } from 'uuid';
import { UserEntity } from '../entities/User.js';
import { UserCreateResponseDto } from '../dtos/user.dto.js';
import dayjs from 'dayjs';

class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    createUser = async (createUserDto) => {
        // Validation Check
        // await Promise.all([
        //     this.checkIsDuplicateEmail(createUserDto.email),
        //     this.checkIsDuplicateNickname(createUserDto.nickName)
        // ]);

        const separatedEmail = UserEntity.separateEmail(createUserDto.email);
        const hashedPassword = await UserEntity.hashPassword(createUserDto.password);
        const displayId = await DisplayIdEntity.getUserSeqDisplayId();

        const newUser = UserEntity.fromJson({
            id: uuidv7(),
            displayId,
            emailAddress: separatedEmail.emailAddress,
            emailDomain: separatedEmail.emailDomain,
            password: hashedPassword,
            nickName: createUserDto.nickName,
            profileImageUrl: null,
            createdAt: dayjs().toDate(),
            updatedAt: dayjs().toDate(),
            deletedAt: null
        });

        // CREATE
        const result = await this.userRepository.create(newUser);
        console.log(result);

        // displayId 다음으로 설정

        return new UserCreateResponseDto(newUser.id, newUser.displayId, newUser.emailAddress, newUser.nickName);
    };

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
