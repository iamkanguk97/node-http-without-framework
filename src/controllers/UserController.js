'use strict';

import { userService } from '../services/UserService.js';
import { UserCreateRequestDto } from '../dtos/UserDto.js';
import { ResponseHandler } from '../utils/ResponseHandler.js';

class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    postUser = async (req, res) => {
        const { email, password, nickname } = req.body;

        const result = await this.userService.createUser(
            UserCreateRequestDto.create(email, password, nickname)
        );

        return ResponseHandler.created(res, result, '사용자가 성공적으로 생성되었습니다.');
    };

    /**
     * 모든 사용자 조회
     * @param {*} req HTTP 요청 객체
     * @param {*} res HTTP 응답 객체
     */
    getUserList = async (req, res) => {
        const result = await this.userService.findAllUsers();

        return ResponseHandler.ok(res, result, '사용자 목록을 성공적으로 조회했습니다.');
    };

    /**
     * ID로 사용자 조회
     * @param {*} req HTTP 요청 객체
     * @param {*} res HTTP 응답 객체
     */
    getUserById = async (req, res) => {
        const { id } = req.params;

        // Validation Check
        if (!id) {
            return ResponseHandler.badRequest(res, null, '사용자 ID를 입력해주세요.');
        }

        const result = await this.userService.findUserById(id);

        if (!result) {
            return ResponseHandler.notFound(res, null, '사용자를 찾을 수 없습니다.');
        }

        return ResponseHandler.ok(res, result, '사용자 정보를 성공적으로 조회했습니다.');
    };

    /**
     * 닉네임 중복 검사
     * @param {*} req HTTP 요청 객체
     * @param {*} res HTTP 응답 객체
     */
    getUserCheckNickName = async (req, res) => {
        const { nickName } = req.query;

        // Validation Check
        if (!nickName) {
            return ResponseHandler.badRequest(res, null, '닉네임을 입력해주세요.');
        }

        await this.userService.checkIsDuplicateNickname(nickName);

        return ResponseHandler.ok(res, null, '사용 가능한 닉네임입니다.');
    };

    /**
     * 이메일 중복 검사
     * @param {*} req HTTP 요청 객체
     * @param {*} res HTTP 응답 객체
     */
    getUserCheckEmail = async (req, res) => {
        const { email } = req.query;

        // Validation Check
        if (!email) {
            return ResponseHandler.badRequest(res, null, '이메일을 입력해주세요.');
        }

        await this.userService.checkIsDuplicateEmail(email);

        return ResponseHandler.ok(res, null, '사용 가능한 이메일입니다.');
    };

    /**
     * 사용자 로그인
     * @param {*} req HTTP 요청 객체
     * @param {*} res HTTP 응답 객체
     */
    postUserLogin = async (req, res) => {
        const { email, password } = req.body;

        // Validation Check
        if (!email || !password) {
            return ResponseHandler.badRequest(res, null, '이메일과 비밀번호를 모두 입력해주세요.');
        }

        const user = await this.userService.loginUser(email, password);

        // 비밀번호 정보는 응답에서 제외
        const responseData = {
            id: user.id,
            displayId: user.displayId,
            email: user.getFullEmail(),
            nickName: user.nickName,
            profileImageUrl: user.profileImageUrl
        };

        return ResponseHandler.ok(res, responseData, '로그인에 성공했습니다.');
    };
}

export const userController = new UserController(userService);
