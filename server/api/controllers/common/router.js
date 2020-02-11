import Controller from "./controller";

import * as express from "express";
import { get } from "mongoose";


export  default express.Router()
                .get("/ranking",Controller.ranking)