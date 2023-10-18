const knex = require("../db/connection");

function list() {
  return knex("movies").select("*");
}

function listShowing() {
    return knex("movies as m")
    .distinct("m.*")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.*", "m.runtime_in_minutes as runtime")
    .where({"mt.is_showing": true});
}

function read(movie_id) {
    return knex("movies")
      .select("*")
      .where({ "movies.movie_id": movie_id })
      .first();
  }

function listTheaters(movie_id) {
    return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select(
        "t.*",
        "mt.is_showing",
        "m.movie_id"
        )
    .where({"m.movie_id": movie_id, "mt.is_showing": true});
}


function listReviews(movie_id) {
    return knex("reviews as r")
      .join("critics as c", "r.critic_id", "c.critic_id")
      .select("r.*", "c.*", "c.created_at AS critic_created_at", "c.updated_at AS critic_updated_at")
      .where({ "r.movie_id": movie_id })
      .then((reviews) => {
        const formattedReviews = reviews.map((review) => {
          return {
            review_id: review.review_id,
            content: review.content,
            score: review.score,
            created_at: review.created_at,
            updated_at: review.updated_at,
            critic_id: review.critic_id,
            movie_id: review.movie_id,
            critic: {
              critic_id: review.critic_id,
              preferred_name: review.preferred_name,
              surname: review.surname,
              organization_name: review.organization_name,
              created_at: review.critic_created_at,
              updated_at: review.critic_updated_at,
            },
          };
        });
        return formattedReviews;
      });
  }

module.exports = {
    list,
    listShowing,
    read,
    listTheaters,
    listReviews
}