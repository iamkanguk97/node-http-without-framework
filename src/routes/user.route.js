'use strict';

import Router from '../common/router/index.js';
import { userController } from '../controllers/user.controller.js';

const userRouter = new Router();

/**
 * Create a new user.
 */
userRouter.post('/users', userController.postUser);

/**
 * Find all users.
 */
userRouter.get('/users', userController.getUserList);

/**
 * Find a user by id.
 */
userRouter.get('/users/:id', userController.getUserById);

/**
 * Check the nickname is already exists or not.
 */
userRouter.get('/users/check-nickname', userController.getUserCheckNickName);

/**
 * Check the email is already exists or not.
 */
userRouter.get('/users/check-email', userController.getUserCheckEmail);

export default userRouter;
