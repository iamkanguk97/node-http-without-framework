class UserController {
    constructor() {}

    /**
     * Create a new user controller
     * @param {} req
     * @param {*} res
     */
    postUser(req, res) {
        res.end('Hello World!');
    }
}

export const userController = new UserController();
