import TVShowsDocument from '../model/TVShows.model';
import { Request, Response } from 'express';
import GenresTVShow from '../model/genreTVShow.model';
import axios from 'axios';

export async function getAllTVShows(req: any, res: Response) {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
    try {
        const results = await TVShowsDocument.find()
            .skip((page - 1) * limit)
            .limit(limit);

        const totalItems =  results.length;

        res.json({
            results,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        });
    } catch (error: any) {
        res.sendStatus(500).send({ message: error.message });
    }
};


export async function getOneTVShow(req: any, res: Response) {
    console.log(req.params)
    try {
        const id = req.params.id
        const result = await TVShowsDocument.findOne({ id });
        console.log(result)
        res.json({ result });
    } catch (error: any) {
        res.sendStatus(500).send({ message: error.message });
    }
};


export async function filterAllSeries(req: any, res: Response) { 
 
    let genre_ids:any[] = [];
    console.log(req.body)
    if(req.body.genre_ids.length > 0){
        genre_ids  = req.body.genre_ids
    }else{
        const genre = await  GenresTVShow.find();
        genre.forEach((el:any) =>{
            genre_ids.push(el.id)
        })
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const results = await TVShowsDocument.aggregate([
            {
              $match: {
                name: {$regex : req.body.name},
                genre_ids: { $in: genre_ids }
              }
            }
          ])
            .skip((page - 1) * limit)
            .limit(limit);

        const totalItems = results.length;

        res.json({
            results,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        });
    } catch (error: any) {
        res.sendStatus(500).send({ message: error.message });
    }
};