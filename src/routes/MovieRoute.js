'use strict';

import Router from '../common/router/index.js';
import { movieController } from '../controllers/MovieController.js';

const movieRouter = new Router({ prefix: '/movies' });

movieRouter.post('/', movieController.postMovie);

movieRouter.get('/', movieController.getMovieList);

movieRouter.get('/:id', movieController.getMovieById);

export default movieRouter;
