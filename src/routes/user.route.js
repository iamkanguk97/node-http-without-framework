import Router from '../common/router/index.js';
import { userController } from '../controllers/user.controller.js';

const userRouter = new Router();

/**
 * Create a new user.
 */
userRouter.post('/users', (req, res) => {
    userController.postUser(req, res);
});

export default userRouter;
