const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Middleware

async function movieExists(req, res, next) {
    const movie = await moviesService.read(req.params.movieId);
        if (movie) {
          res.locals.movie = movie;
          return next();
        }
        next({ status: 404, message: "Movie cannot be found." });
  }


// CRUD

async function list(req, res, next) {
    if (req.query.is_showing === "true") {
        const data = await moviesService.listShowing();
        res.json({ data });
    } else {
    const data = await moviesService.list();
      res.json({ data });
    }
  }

function read(req, res) {
    const { movie: data } = res.locals;
    res.json({ data });
}

async function readTheaters(req, res, next) {
    const { movie } = res.locals;
    const data = await moviesService.readTheaters(movie.movie_id);
    res.json({ data });
}

async function readReviews(req, res, next) {
    const { movie } = res.locals;
    const data = await moviesService.readReviews(movie.movie_id);
    res.json({ data })
}

module.exports = {
    read: [asyncErrorBoundary(movieExists), read],
    list: [asyncErrorBoundary(list)],
    readTheaters: [asyncErrorBoundary(movieExists), asyncErrorBoundary(readTheaters)],
    readReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(readReviews)]
}