import mongoose from "mongoose";
import { UserDocument } from "./user.model";

//spécifie les propriétés requises pour un document de session.
export interface MovieDocument extends mongoose.Document {
    adult: Boolean;
    backdrop_path: String;
    genre_ids: [
        Number
    ];
    id: Number;
    original_language: String;
    original_title: String;
    overview: String;
    popularity: Number;
    poster_path: String;
    release_date: String;
    title: String;
    video: Boolean;
    vote_average: Number;
    vote_count: Number;
}

const MoviesSchema = new mongoose.Schema(
    {
        adult: Boolean,
        backdrop_path: String,
        genre_ids: [Number],
        id: Number,
        original_language: String,
        original_title: String,
        overview: String,
        popularity: Number,
        poster_path: String,
        release_date: String,
        title: String,
        video: Boolean,
        vote_average: Number,
        vote_count: Number,
    },
    { timestamps: true }
);

const Movies = mongoose.model<MovieDocument>("Movies", MoviesSchema);

export default Movies;