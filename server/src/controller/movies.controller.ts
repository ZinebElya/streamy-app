import MovieDocument from '../model/movie.model';
import { Request, Response } from 'express';
import Genres from '../model/genre.model';



export async function getAllMovies(req: any, res: Response) {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const results = await MovieDocument.find()
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


export async function getOneMovie(req: any, res: Response) {

    try {
        const id = req.params.id
        const result = await MovieDocument.findOne({ id });
       
        res.json({ result });
    } catch (error: any) {
        res.sendStatus(500).send({ message: error.message });
    }
};

export async function filterAllMovies(req: any, res: Response) {   
    let genre_ids:any[] = [];
    console.log(req.body)
    if(req.body.genre_ids.length > 0){
        genre_ids  = req.body.genre_ids
    }else{
        const genre = await  Genres.find();
        genre.forEach(el =>{
            genre_ids.push(el.id)
        })
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const results = await MovieDocument.aggregate([
            {
              $match: {
                title: {$regex : req.body.title},
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