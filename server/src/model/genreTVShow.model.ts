import mongoose from "mongoose";

export interface GenreTVShowDocument extends mongoose.Document {

    id: Number;
    name:String;

}

const GenresTVShowSchema = new mongoose.Schema(
    {
       id: Number,
       name: { type: String, required: true },
    },
    { timestamps: true }
);

const GenresTVShow = mongoose.model<GenreTVShowDocument >("GenresTVShow", GenresTVShowSchema);

export default GenresTVShow;

