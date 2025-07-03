'use strict';

import Router from '../common/router/index.js';
import { userController } from '../controllers/user.controller.js';

const userRouter = new Router({ prefix: '/' });

/**
 * Create a new user.
 */
userRouter.post('/', userController.postUser);

/**
 * Find all users.
 */
userRouter.get('/', userController.getUserList);

/**
 * Find a user by id.
 */
userRouter.get('/:id', userController.getUserById);

/**
 * Check the nickname is already exists or not.
 */
userRouter.get('/check-nickname', userController.getUserCheckNickName);

/**
 * Check the email is already exists or not.
 */
userRouter.get('/check-email', userController.getUserCheckEmail);

export default userRouter;
