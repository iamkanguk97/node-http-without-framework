'use strict';

class UserController {
    constructor() {}

    /**
     * Create a new user controller
     * @param {} req
     * @param {*} res
     */
    postUser(req, res) {
        console.log(req.body);

        // Request-Body Validation

        res.end('Hello World!');
    }
}

export const userController = new UserController();
