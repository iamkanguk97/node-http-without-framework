'use strict';

import { userRepository } from '../repositories/user.repository.js';
import { DisplayId } from '../domains/DisplayId.js';
import { v7 as uuidv7 } from 'uuid';
import { User } from '../domains/User.js';

class UserService {

  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Create user service
   * @param {*} createUserDto
   */
  async createUser(createUserDto) {
    // const newUserId =
    // nickName 중복확인
    // email 중복확인
    // password 암호화
    // displayId
    // INSERT

    const displayId = await DisplayId.getUserSeqDisplayId();
    console.log(displayId);

    const newUser = User.from({
      id: uuidv7(),
      displayId,
      emailAddress: 'asdf',
      emailDomain: 'aaaa',
      password: 'asdf',
      nickName: '욱이',
      profileImageUrl: 'asdf',
    });

    console.log(newUser);

    return {
      id: newUser.id,
      displayId: newUser.displayId
    }
  }

  async findUserById(id) {
    const result = await this.userRepository.findById(id);
    return result;
  }

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
