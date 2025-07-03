'use strict';

import { userService } from '../services/UserService.js';
import { UserCreateRequestDto } from '../dtos/UserDto.js';
import { ResponseHandler } from '../utils/ResponseHandler.js';

class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    postUser = async (req, res) => {
        const { email, password, nickName } = req.body;

        const result = await this.userService.createUser(
            UserCreateRequestDto.create(email, password, nickName)
        );

        return ResponseHandler.created(res, result, '사용자가 성공적으로 생성되었습니다.');
    };

    /**
     * Get all users controller
     * @param {*} req
     * @param {*} res
     */
    getUserList = async (req, res) => {
        const result = await this.userService.findAll();

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(
            JSON.stringify({
                success: true,
                data: result,
                message: '사용자 목록을 성공적으로 조회했습니다.'
            })
        );
    };

    getUserById = async (req, res) => {
        const { id } = req.params;

        // Validation Check
        if (!id) {
            throw new Error('사용자 ID를 입력해주세요.');
        }

        const result = await this.userService.findUserById(id);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(
            JSON.stringify({
                success: true,
                data: result,
                message: '사용자 정보를 성공적으로 조회했습니다.'
            })
        );
    };

    /**
     * @Controller
     * @description Check user nickname is duplicate or not.
     * @param {*} req
     * @param {*} res
     */
    getUserCheckNickName = async (req, res) => {
        const { nickName } = req.query;

        // Validation Check
        if (!nickName) {
            throw new Error('닉네임을 입력해주세요.');
        }

        await this.userService.checkIsDuplicateNickname(nickName);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(
            JSON.stringify({
                success: true,
                message: '사용 가능한 닉네임입니다.'
            })
        );
    };

    /**
     * @Controller
     * @description Check user email is duplicate or not.
     * @param {*} req
     * @param {*} res
     */
    getUserCheckEmail = async (req, res) => {
        const { email } = req.query;

        // Validation Check
        if (!email) {
            throw new Error('이메일을 입력해주세요.');
        }

        await this.userService.checkIsDuplicateEmail(email);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(
            JSON.stringify({
                success: true,
                message: '사용 가능한 이메일입니다.'
            })
        );
    };
}

export const userController = new UserController(userService);
