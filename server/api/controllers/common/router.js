import Controller from "./controller";

import * as express from "express";
import { get } from "mongoose";


export  default express.Router()
                .get("/ranking",Controller.ranking)
                .get("/class/:id", Controller.getClassById)
                .get("/class", Controller.getAll)
                .post("/class", Controller.createClass)
                .put("/class", Controller.updateClass)
                