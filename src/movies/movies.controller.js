const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Middleware

// movieExists validates that there is a movie that matches the movieId in request params.
// if the movie exists, it is saved in res.locals. otherwise, it responds with an error.

async function movieExists(req, res, next) {
    const movie = await moviesService.read(req.params.movieId);
        if (movie) {
          res.locals.movie = movie;
          return next();
        }
        next({ status: 404, message: "Movie cannot be found." });
  }


// CRUD

// list function calls list or listShowing service based on if "if_showing" is true and sends response.

async function list(req, res, next) {
    if (req.query.is_showing === "true") {
        const data = await moviesService.listShowing();
        res.json({ data });
    } else {
    const data = await moviesService.list();
      res.json({ data });
    }
  }

// read function sends movie object as response after movieExists validator saves the movie to res.locals.

function read(req, res) {
    const { movie: data } = res.locals;
    res.json({ data });
}

// listTheaters function calls listTheaters service and sends response.

async function listTheaters(req, res, next) {
    const { movie } = res.locals;
    const data = await moviesService.listTheaters(movie.movie_id);
    res.json({ data });
}

// listReviews function calls listReviews service and sends response.

async function listReviews(req, res, next) {
    const { movie } = res.locals;
    const data = await moviesService.listReviews(movie.movie_id);
    res.json({ data })
}

module.exports = {
    read: [asyncErrorBoundary(movieExists), read],
    list: [asyncErrorBoundary(list)],
    listTheaters: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listTheaters)],
    listReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listReviews)]
}