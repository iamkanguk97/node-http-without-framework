class MovieController {
    constructor(movieService) {
        this.movieService = movieService;
    }

    postMovie = async (req, res) => {
        res.end('POST MOVIE!');
    };

    getMovieList = async (req, res) => {
        res.end('GET MOVIE LIST!');
    };

    getMovieById = async (req, res) => {
        res.end('GET MOVIE BY ID!');
    };
}

export const movieController = new MovieController();
