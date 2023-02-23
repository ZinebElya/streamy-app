import { Request, Response } from "express";
import Rating, { RatingDocument } from "../model/rating.model";

export async function addRating(req: Request, res: Response) {
    try {
        const { user, movie, score } = req.body;

        // Vérifie si l'utilisateur a déjà noté ce film
        const existingRating = await Rating.findOne({ user, movie });

        if (existingRating) {
            // Si l'utilisateur a déjà noté le film, met à jour la note existante
           // existingRating.score = score;
            await existingRating.save();

            return res.json({
                message: "Your rating has been updated.",
            });
        }

        // Crée un nouveau document Rating
        const newRating: RatingDocument = new Rating({
            user,
            movie,
            score,
        });

        // Enregistre le nouveau document en base de données
        await newRating.save();

        res.status(201).json({
            message: "Your rating has been added.",
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export async function getRatingsByUser(req: Request, res: Response) {
    try {
        const { userId } = req.params;

        // Récupère les notes de l'utilisateur spécifié
        const ratings = await Rating.find({ user: userId }).populate(
            "movie"
        );

        res.json(ratings);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export async function getMovieRating(req: Request, res: Response) {
    try {
        const { movieId } = req.params;

        // Récupère les notes du film
        const ratings = await Rating.find({ movie: movieId }).populate(
            "user"
        );

        res.json(ratings);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
