import Router from '../common/router/index.js';
import { userController } from '../controllers/user.controller.js';

const userRouter = new Router();

/**
 * Create a new user.
 */
userRouter.post('/users', async (req, res) => {
    await userController.postUser(req, res);
});

/**
 * Find all users.
 */
userRouter.get('/users', (req, res) => {
    userController.getUser(req, res);
});

/**
 * Find a user by id.
 */
userRouter.get('/users/:id', (req, res) => {
    userController.getUserById(req, res);
});

export default userRouter;
