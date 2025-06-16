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
      nickName,
    });

    console.log(result);

    res.end('hello!');
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

  /**
   * @Controller
   * @description Check user nickname is duplicate or not.
   * @param {*} req
   * @param {*} res
   * 
   * @todo chunk 에러 해결필요!
   */
  getUserCheckNickName = async (req, res) => {
    const { nickName } = req.query;

    // Validation Check

    await this.userService.checkIsDuplicateNickname(nickName);

    res.end({
      isSuccess: true,
      message: '사용 가능한 닉네임입니다.',
    });
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

    await userService.checkIsDuplicateEmail(email);

    res.end({
      isSuccess: true,
      message: '사용 가능한 이메일입니다.',
    });
  };
}

export const userController = new UserController(userService);
