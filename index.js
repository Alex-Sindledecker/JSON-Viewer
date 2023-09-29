import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

import {dirname} from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const port = 3000;
const app = express();
const randomCategories = {
    "posts":	100,
    "comments":	500,
    "albums":	100,
    "photos":	500, 
    "todos":	200,
    "users":	10
};

app.use(express.static(__dirname + "/static"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.render(__dirname + "/views/index.ejs");
});

app.get("/random/:category", async (req, res) => {
    try{
        if (req.params.category in randomCategories === false)
            return res.redirect("/");

        let index = Math.ceil(Math.random() * randomCategories[req.params.category]);
        let response = await axios.get(`https://jsonplaceholder.typicode.com/${req.params.category}/${index}`);

        res.render(__dirname + "/views/index.ejs", {json: JSON.stringify(response.data)});

    } catch (error){
        console.log(error.message);
        res.render(__dirname + "/views/index.ejs");
    }
});

app.listen(port, () => {
    console.log("App running on port 3000");
});