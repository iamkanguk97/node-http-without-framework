'use strict';

import { userRepository } from '../repositories/user.repository.js';

class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async createUser(postUserDto) {
        // Repository 호출
        console.log('hihi');
    }
}

export const userService = new UserService(userRepository);
