// src/app.ts
import express from "express";
import config from "config";
import mongoose from "mongoose";
import routes from "./routes";
import cors from 'cors';


const PORT = process.env.PORT || config.get("port") as any;
//const host = config.get("host") as string;
const url = "mongodb+srv://user:g09UU8Z2B8CYqlf7@cluster0.qkbvo.mongodb.net/StreamingApp?retryWrites=true&w=majority";
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
        app.listen(PORT,  () => {
            console.log(`Server listing at http://localhost:${PORT}`);
            routes(app);
        });
    })
    .catch(err => {
        console.log(err);
    });
