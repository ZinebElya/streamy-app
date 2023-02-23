import { Request, Response } from "express";
import Genres, { GenreDocument } from "../model/genre.model";
import Movies, { MovieDocument } from "../model/movie.model";


export const searchMovies = async (req: Request, res: Response) => {
const query = req.query.q; // récupérer la requête de recherche de l'utilisateur

if (!query) {
    return res.status(400).json({ message: "The search query is required." });
}

let movies: MovieDocument[] = [];

// si l'utilisateur a fourni un genre, rechercher les films correspondants à ce genre
if (req.query.genre) {
    const genreName = req.query.genre;
    const genre: GenreDocument | null = await Genres.findOne({ name: genreName }).exec();

    if (!genre) {
        return res.status(404).json({ message: "Genre not found." });
      }
      
      movies = await Movies.find({ genre_ids: genre.id, title: { $regex: query, $options: "i" } }).exec();

    } else {
        // sinon, rechercher tous les films
        movies = await Movies.find({ title: { $regex: query, $options: "i" } }).exec();
        }
        
        if (movies.length === 0) {
        return res.status(404).json({ message: "No movies found." });
        }
        
        return res.status(200).json({ movies, size : movies.length});
};
