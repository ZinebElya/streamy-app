
import mongoose from "mongoose";
import { UserDocument } from "./user.model";

//spécifie les propriétés requises pour un document de session.
export interface GenreDocument extends mongoose.Document {

    id: Number;
    name:String;

}

const GenresSchema = new mongoose.Schema(
    {
       id: Number,
       name:String,
    },
    { timestamps: true }
);

const Genres = mongoose.model<GenreDocument>("Genres", GenresSchema);

export default Genres;