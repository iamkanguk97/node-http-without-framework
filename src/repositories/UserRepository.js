'use strict';

import path from 'path';
import { promises as fs } from 'fs';
import { __dirname } from '../utils/path.util.js';
import { UserEntity } from '../entities/User.js';
import { writeJsonFileWithFs } from '../utils/file.util.js';

class UserRepository {
    constructor() {
        this.databaseFilePath = path.join(__dirname(), '../../data/User.json');
    }

    findAll = async () => {
        const userData = await fs.readFile(this.databaseFilePath, 'utf8');
        return JSON.parse(userData).map(UserEntity.fromJson);
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

    create = async (userEntity) => {
        const userList = await this.findAll();
        userList.push(userEntity);
        await this.save(userList.map((user) => user.toJson()));
        return userEntity;
    };

    save = async (data) => {
        await fs.writeFile(this.databaseFilePath, JSON.stringify(data));
    };

    findByEmail = async (emailLocalPart, emailDomainPart) => {
        return (await this.findAll()).find(
            (user) => user.emailLocalPart === emailLocalPart && user.emailDomainPart === emailDomainPart
        );
    };

    findByNickname = async (nickname) => {
        return (await this.findAll()).find((user) => user.nickname === nickname);
    };
}

export const userRepository = new UserRepository();
