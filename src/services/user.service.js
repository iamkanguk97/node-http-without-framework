'use strict';

import { userRepository } from '../repositories/user.repository.js';

class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async createUser(postUserDto) {
        // Repository 호출
        // Entity로 변환
        console.log('hihi');
        const result = await this.userRepository.findAll();
        console.log(result);

        await this.userRepository.create();
        const result2 = await this.userRepository.findAll();
        console.log(result2);
    }

    async findUserById(id) {
        const result = await this.userRepository.findById(id);
        return result;
    }
}

export const userService = new UserService(userRepository);
