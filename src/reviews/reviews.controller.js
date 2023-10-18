const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Middleware

// reviewExists function validates that a review matches the reviewId in request params.
// if it matches, it saves the review object to res.locals. otherwise, it responds with an error.

async function reviewExists(req, res, next) {
    const review = await reviewsService.read(req.params.reviewId);
        if (review) {
          res.locals.review = review;
          return next();
        }
        next({ status: 404, message: "Review cannot be found." });
  }

// CRUD

// update function calls update service with the review saved in res.locals.
// after update service runs, it calls returnUpdate with the review_id and sends the response.

async function update(req, res, next) {
    const updatedReview = {
      ...req.body.data,
      review_id: res.locals.review.review_id,
    };
    await reviewsService.update(updatedReview);
    const { review } = res.locals;
    const data = await reviewsService.returnUpdate(review.review_id)
      res.json({ data });
  }

// destroy function calls destroy service with a given review_id.

async function destroy(req, res) {
    const { review } = res.locals;
    await reviewsService.destroy(review.review_id);
    res.sendStatus(204);
}

module.exports = {
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)]
}