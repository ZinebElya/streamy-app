import { Request, Response } from "express";
import TVShows, { TVShowsDocument } from "../model/TVShows.model";
import GenresTVShow, { GenreTVShowDocument  } from "../model/genreTVShow.model";


export const filtreAndSearchTVShows = async (req: any, res: Response) => {
    const query = req.query.q; 
    const genreIds = req.query.genreIds 
    if (!query && !genreIds) {
      const tvShows = await TVShows.find().exec();
      return res.status(200).json({ tvShows, size: tvShows.length });
    }

    let tvShows: any[] = await TVShows.find().exec();;

  
    if (query) {
        tvShows = await TVShows.find({ name: { $regex: query, $options: "i" } }).exec();
    }

    if (genreIds) {
        let tab = genreIds?.split(",");
      const genreIdsAsNumbers = tab.map((id: any) => parseInt(id, 10));
      tvShows = tvShows.filter((tvShow) => {
        return genreIdsAsNumbers.some((genreId: any) => tvShow.genre_ids.includes(genreId))
      });
    }

    if (tvShows.length === 0) {
      return res.status(404).json({ message: "No tvShows found." });
    }

    return res.status(200).json({ tvShows, size: tvShows.length });
};
