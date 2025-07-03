'use strict';

import Router from '../common/router/index.js';
import { movieController } from '../controllers/movie.controller.js';

// const movieRouter = new Router({ prefix: '/movies' });
const movieRouter = new Router({ prefix: '/' });

movieRouter.post('/', movieController.postMovie);

movieRouter.get('/', movieController.getMovieList);

movieRouter.get('/:id', movieController.getMovieById);

export default movieRouter;
