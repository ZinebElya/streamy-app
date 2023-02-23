// src/app.ts
import express from "express";
import config from "config";
import mongoose from "mongoose";
import routes from "./routes";
import cors from 'cors';


const port = config.get("port") as number;
const host = config.get("host") as string;
const url = config.get("dbUri") as string;
const app = express();

// Parses incoming requests with JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


mongoose
    .connect(
        url
    )
    .then(() => {
        app.listen(port, host, () => {
            console.log(`Server listing at http://${host}:${port}`);
            routes(app);
        });
    })
    .catch(err => {
        console.log(err);
    });
