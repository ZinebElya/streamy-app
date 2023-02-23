import mongoose from "mongoose";
import { UserDocument } from "./user.model";
import { MovieDocument } from "./movie.model";
import { TVShowsDocument } from "./TVShows.model";

// Spécifie les propriétés requises pour un document de favori.
export interface FavoriteDocument extends mongoose.Document {
    user: UserDocument["_id"];
    movie: MovieDocument["_id"];
    tvShow: TVShowsDocument["_id"];
    
}

const FavoriteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        movie:[],
        tvShow: [],
    },
    { timestamps: true }
);

const Favorite = mongoose.model<FavoriteDocument>("Favorite", FavoriteSchema);

export default Favorite;
