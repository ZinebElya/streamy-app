
import { Request, Response } from 'express';
import Genres from '../model/genre.model';

export async function getAllGenres(req: Request, res: Response) {
try {
const results = await Genres.find();
res.json({ results });
} catch (error: any) {
res.status(500).send({ message: error.message });
}
};

//avec un id // 1genre

export async function getGenreById(req: Request, res: Response) {
try {
const genreId = req.params.id;
const genre = await Genres.findById(genreId);

if (!genre) {
    return res.status(404).send({ message: "Genre not found" });
  }
  
  res.json({ genre });

} catch (error: any) {
    res.status(500).send({ message: error.message });
    }
    };

// récupérer plusieurs genres en une seule requête

export async function getGenresByIds(req: Request, res: Response) {
    try {
    const genreIds = req.body.genreIds;

    const genres = await Genres.find({ _id: { $in: genreIds } }); // $in (opérateur mongoose) Récupère les genres correspondants aux identifiants passés dans le tableau

res.json({ genres });

} catch (error: any) {
    res.status(500).send({ message: error.message });
    }
    };

