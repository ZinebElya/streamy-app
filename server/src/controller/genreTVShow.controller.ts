import GenreTVShowDocument from '../model/genreTVShow.model';
import { Request, Response } from 'express';

export async function getAllTVShowsGenres(req: Request, res: Response) {
try {
const results = await GenreTVShowDocument.find();
res.json({ results });
} catch (error: any) {
res.status(500).send({ message: error.message });
}
};

// récupérer plusieurs genres en une seule requête

export async function getGenresTVShowsByIds(req: Request, res: Response) {
    try {
    const genreIds = req.body.genreIds;

    const genres = await GenreTVShowDocument.find({ _id: { $in: genreIds } }); // $in (opérateur mongoose) Récupère les genres correspondants aux identifiants passés dans le tableau

res.json({ genres });

} catch (error: any) {
    res.status(500).send({ message: error.message });
    }
    };

