'use strict';

import { userService } from '../services/user.service.js';

class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    /**
     * Create a new user controller
     * @param {*} req
     * @param {*} res
     */
    postUser = async (req, res) => {
        const { email, password, nickName } = req.body;

        // Validation

        const result = await this.userService.createUser({
            email,
            password,
            nickName
        });

        res.end('Hello World!');
    };

    /**
     * Get all users controller
     * @param {*} req
     * @param {*} res
     */
    getUserList = async (req, res) => {
        const result = await this.userService.findAll();
        console.log(result);

        res.end('Hello World!');
    };

    /**
     * Get a user by id controller
     * @param {*} req
     * @param {*} res
     */
    getUserById = async (req, res) => {
        const { id } = req.params;
        console.log(id);

        const result = await this.userService.findUserById(id);
        console.log(result);

        res.end('Hello World!');
    };

    getCheckUserNickname = async (req, res) => {
        const { nickName } = req.query;
        console.log(nickName);
        res.end('Hello World!');
    };
}

export const userController = new UserController(userService);
