'use strict';

import path from 'path';
import { promises as fs } from 'fs';
import { __dirname } from '../utils/path.util.js';
import { UserEntity } from '../entities/User.js';
import { readFileWithFs, writeJsonFileWithFs } from '../utils/file.util.js';

class UserRepository {
    constructor() {
        this.databaseFilePath = path.join(__dirname(), '../../data/User.json');
    }

    /**
     * @Repository
     * @returns {Promise<UserEntity[]>}
     */
    findAll = async () => {
        const rawUserList = await readFileWithFs(this.databaseFilePath);
        const parsedUserList = JSON.parse(rawUserList);
        return parsedUserList.map(UserEntity.fromJson);
    };

    /**
     * @Repository
     * @returns {Promise<[]>}
     */
    findById = async (id) => {
        const data = await fs.readFile(path.join(__dirname, '../../data/users.json'), 'utf8');
        const users = JSON.parse(data);
        const user = users.find((user) => user.id === id);
        return user;
    };

    /**
     * @Repository
     * @param {UserEntity} userEntity
     * @returns {Promise<UserEntity>}
     */
    create = async (userEntity) => {
        const userList = await this.findAll();
        userList.push(userEntity);
        await this.save(userList.map((user) => user.toJson()));
        return userEntity;
    };

    /**
     * @Repository
     * @param {UserEntity[]} users
     * @returns {Promise<void>}
     */
    save = async (users) => {
        await writeJsonFileWithFs(this.databaseFilePath, users);
    };

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
