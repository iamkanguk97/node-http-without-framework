import { generateNextDisplayId } from './display-id.util.js';
import { v4 as uuidv4 } from 'uuid';
import User from '../domains/User.js';

/**
 * 새로운 User 객체를 생성합니다.
 * UUID와 Display ID를 자동으로 생성합니다.
 * @param {Object} userData - 사용자 데이터
 * @param {string} userData.email - 이메일
 * @param {string} userData.password - 비밀번호
 * @param {string} userData.nickName - 닉네임
 * @returns {User} 생성된 User 객체
 */
export function createUser(userData) {
    const now = new Date();

    const userWithIds = {
        id: uuidv4(),
        displayId: generateNextDisplayId('User'),
        email: userData.email,
        password: userData.password,
        nickName: userData.nickName,
        createdAt: now,
        updatedAt: now,
        deletedAt: null
    };

    return new User(userWithIds);
}

/**
 * 기존 데이터로부터 User 객체를 생성합니다.
 * @param {Object} userData - 완전한 사용자 데이터
 * @returns {User} User 객체
 */
export function createUserFromData(userData) {
    return new User(userData);
}
