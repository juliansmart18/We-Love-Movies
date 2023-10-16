const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");
const reduceProperties = require("../utils/reduce-properties");

function list() {
  return knex("movies").select("*");
}

function listShowing() {
    return knex("movies as m")
    .distinct("m.*")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.*")
    .where({"mt.is_showing": true});
}

function read(movie_id) {
    return knex("movies")
      .select("*")
      .where({ "movies.movie_id": movie_id })
      .first();
  }

function readTheaters(movie_id) {
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

const addCritic = mapProperties({
    critic_id: "critics.critic_id",
    preferred_name: "critics.preferred_name",
    surname: "critics.surname",
    organization_name: "critics.organization_name",
    created_at: "critics.created_at",
    updated_at: "critics.updated_at"
})

function readReviews(movie_id) {
    return knex("movies as m")
      .join("reviews as r", "m.movie_id", "r.movie_id")
      .join("critics as c", "r.critic_id", "c.critic_id")
      .select("r.*", "c.*")
      .where({ "m.movie_id": movie_id })
  }

module.exports = {
    list,
    listShowing,
    read,
    readTheaters,
    readReviews
}