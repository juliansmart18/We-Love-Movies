const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

// returns an array of all theaters. each theater object includes a "movies" property with a nested array of movies showing.

// uses reduceProperties function to reduce movies into an array contained by "movies" property.

function list() {
    return knex("theaters as t")
      .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
      .join("movies as m", "mt.movie_id", "m.movie_id")
      .select("t.*", "mt.is_showing", "m.*")
      .where({ "mt.is_showing": true })
      .then((data) => {
        const configuration = {
          movie_id: ["movies", null, "movie_id"],
          title: ["movies", null, "title"],
          runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
          rating: ["movies", null, "rating"],
          description: ["movies", null, "description"],
          image_url: ["movies", null, "image_url"],
          created_at: ["movies", null, "created_at"],
          updated_at: ["movies", null, "updated_at"],
          is_showing: ["movies", null, "is_showing"],
        };
        
        const reduceTheaterAndMovies = reduceProperties("theater_id", configuration);
        const transformedData = reduceTheaterAndMovies(data);
        return transformedData;
      });
  }



module.exports = {
    list
}