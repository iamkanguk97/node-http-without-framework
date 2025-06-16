'use strict';

import { promises as fs } from 'fs';
import { __dirname } from '../utils/path.util.js';
import path from 'path';

class UserRepository {
  constructor() {
    this.databaseFilePath = path.join(__dirname(), '../../data/User.json');
  }

  /**
   * @Repository
   * @returns {Promise<User[]>}
   */
  findAll = async () => {
    const userList = await fs.readFile(this.databaseFilePath, 'utf8');
    return JSON.parse(userList);
  };

  create = async (user) => {
    const userList = await this.findAll();
    userList.push(user);

    await fs.writeFile(this.databaseFilePath, 'utf8');

    return user;
  };

  async create() {
    const data = await fs.readFile(
      path.join(__dirname(), '../../data/users.json'),
      'utf8'
    );
    const users = JSON.parse(data);
    users.push({
      id: '1',
      email: 'test@test.com',
      password: '1234',
      nickName: 'test',
    });
    await fs.writeFile(
      path.join(__dirname(), '../../data/users.json'),
      JSON.stringify(users, null, 2)
    );
    return users;
  }

  async findById(id) {
    const data = await fs.readFile(
      path.join(__dirname, '../../data/users.json'),
      'utf8'
    );
    const users = JSON.parse(data);
    const user = users.find((user) => user.id === id);
    return user;
  }

  /**
   * @Repository
   * @param {string} nickname
   * @returns {Promise<User>}
   */
  findByNickname = async (nickname) => {
    const userList = await this.findAll();
    return userList.filter((user) => user.nickname === nickname);
  };

  /**
   * @Repository
   * @param {string} email
   * @returns {Promise<User>}
   */
  findByEmail = async (email) => {
    const userList = await this.findAll();
    return userList.filter((user) => user.email === email);
  };
}

export const userRepository = new UserRepository();
