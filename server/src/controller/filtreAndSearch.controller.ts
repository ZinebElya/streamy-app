import { Request, Response } from "express";
import Movies, { MovieDocument } from "../model/movie.model";
import Genres, { GenreDocument } from "../model/genre.model";


export const filtreAndSearch = async (req: any, res: Response) => {
    const query = req.query.q; // récupérer la requête de recherche de l'utilisateur
    const genreIds = req.query.genreIds // récupérer les ids de genre de l'utilisateur et les convertir en tableau
    
    // si le user ne fournit rien, rechercher tous les films
    if (!query && !genreIds) {
      const movies = await Movies.find().exec();
      return res.status(200).json({ movies, size: movies.length });
    }

    let movies: any[] = await Movies.find().exec();;

    // si le user fournit une requete de recherche, rechercher les films correspendants
    if (query) {
      movies = await Movies.find({ title: { $regex: query, $options: "i" } }).exec();
    }

    // si le user fournit des genreIds, rechercher les films correspondants à ces genreIds
    if (genreIds) {
        let tab = genreIds?.split(",");
      const genreIdsAsNumbers = tab.map((id: any) => parseInt(id, 10));
      movies = movies.filter((movie) => {
        return genreIdsAsNumbers.some((genreId: any) => movie.genre_ids.includes(genreId))
      });
    }

    if (movies.length === 0) {
      return res.status(404).json({ message: "No movies found." });
    }

    return res.status(200).json({ movies, size: movies.length });
};
