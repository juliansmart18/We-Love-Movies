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

async function listTheaters(req, res, next) {
    const { movie } = res.locals;
    const data = await moviesService.listTheaters(movie.movie_id);
    res.json({ data });
}

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