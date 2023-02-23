import mongoose from "mongoose";

//spécifie les propriétés requises pour un document de session.
export interface TVShowsDocument extends mongoose.Document {
    backdrop_path: String;
    first_air_date: String;
    genre_ids: [
        Number
    ];
    id: Number;
    name: String;
    origin_country: [
        String
    ];
    original_language: String;
    original_name: String;
    overview: String;
    popularity: Number;
    poster_path: String;
    vote_average: Number;
    vote_count: Number;
}

const TVShowsSchema = new mongoose.Schema(
    {
        backdrop_path: String,
        first_air_date: String,
        genre_ids: [Number],
        id: Number,
        name: String,
        origin_country: [String],
        original_language: String,
        original_name: String,
        overview: String,
        popularity: Number,
        poster_path: String,
        vote_average: Number,
        vote_count: Number,
    },
    { timestamps: true }
);

const TVShows = mongoose.model<TVShowsDocument>("TVShows", TVShowsSchema);

export default TVShows;