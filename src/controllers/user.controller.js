'use strict';

import { userService } from '../services/user.service.js';

class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    /**
     * Create a new user controller
     * @param {} req
     * @param {*} res
     */
    async postUser(req, res) {
        const { email, password, nickName } = req.body;

        // Validation
        const result = await this.userService.createUser({
            email,
            password,
            nickName
        });

        res.end('Hello World!');
    }
}

export const userController = new UserController(userService);
