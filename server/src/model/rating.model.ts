import mongoose from "mongoose";
import { UserDocument } from "./user.model";
import { MovieDocument } from "./movie.model";

export interface RatingDocument extends mongoose.Document {
    user: UserDocument["_id"];
    movie: MovieDocument["_id"];
    score: Number;
}

const RatingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        movie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",
            required: true,
        },
        score: {
            type: Number,
            required: true,
            min: 1,
            max: 10,
        },
    },
    { timestamps: true }
);

const Rating = mongoose.model<RatingDocument>("Rating", RatingSchema);

export default Rating;
