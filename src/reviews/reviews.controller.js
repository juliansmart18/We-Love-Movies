const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Middleware

async function reviewExists(req, res, next) {
    const review = await reviewsService.read(req.params.reviewId);
        if (review) {
          res.locals.review = review;
          return next();
        }
        next({ status: 404, message: "Review cannot be found." });
  }

// CRUD

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

async function destroy(req, res) {
    const { review } = res.locals;
    await reviewsService.destroy(review.review_id);
    res.sendStatus(204);
}

module.exports = {
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)]
}