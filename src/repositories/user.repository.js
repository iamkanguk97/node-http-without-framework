'use strict';

import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class UserRepository {
    async create() {
        const data = await fs.readFile(path.join(__dirname, '../../data/users.json'), 'utf8');
        const users = JSON.parse(data);
        users.push({ id: '1', email: 'test@test.com', password: '1234', nickName: 'test' });
        await fs.writeFile(path.join(__dirname, '../../data/users.json'), JSON.stringify(users, null, 2));
        return users;
    }

    async findAll() {
        try {
            const data = await fs.readFile(path.join(__dirname, '../../data/users.json'), 'utf8');
            console.log(data);
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading users.json:', error);
            throw new Error('Failed to read users data');
        }
    }

    async findByNickName(nickName) {}

    async findById(id) {
        const data = await fs.readFile(path.join(__dirname, '../../data/users.json'), 'utf8');
        const users = JSON.parse(data);
        const user = users.find(user => user.id === id);
        return user;
    }
}

export const userRepository = new UserRepository();
