'use strict';

import { userRepository } from '../repositories/user.repository.js';
import { DisplayId } from '../domains/DisplayId.js';
import { v7 as uuidv7 } from 'uuid';
import { User } from '../domains/User.js';

class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    createUser = async createUserDto => {
        console.log(createUserDto);

        await Promise.all([
            this.checkIsDuplicateEmail(createUserDto.email),
            this.checkIsDuplicateNickname(createUserDto.nickName)
        ]);

        const displayId = await DisplayId.getUserSeqDisplayId();
        console.log(displayId);

        const newUser = User.from({
            id: uuidv7(),
            displayId,
            emailAddress: 'asdf',
            emailDomain: 'aaaa',
            password: 'asdf',
            nickName: '욱이',
            profileImageUrl: null
        });

        console.log(newUser);

        // CREATE
        // displayId 다음으로 설정

        return {
            id: newUser.id,
            displayId: newUser.displayId
        };
    };

    findUserById = async id => {
        const result = await this.userRepository.findById(id);
        return result;
    };

    /**
     * @Service
     * @param {string} nickname
     */
    checkIsDuplicateNickname = async nickname => {
        const result = await this.userRepository.findByNickname(nickname);

        if (result.length > 0) {
            throw new Error('중복된 닉네임입니다.');
        }
    };

    /**
     * @Service
     * @param {string} email
     */
    checkIsDuplicateEmail = async email => {
        const result = await this.userRepository.findByEmail(email);

        if (result.length > 0) {
            throw new Error('중복된 이메일입니다.');
        }
    };
}

export const userService = new UserService(userRepository);
